/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPRoomEffects = {
    BAO_TAG:3003,
    AN_BAO_TAG:3004,
    ALERT_TAG:3005,
    HUPAI_TAG:9999,
    ZHANGSI_TAG:8888,
    directList:[],

    normalAction:function(root,prefix,source,userId,direct,isReplay){

        var imgConfig = {
            5:"bz", 6:"qys", 7:"bbh", 8:"yzh",
            9:"llx", 10:"dsx", 11:"jtyn", 12:"jjg",
            13:"st", 14:"ztsx", 15:"ztllx", 16:"bz",19:"ydh"
        }

        var isReplay = isReplay || false;
        if(prefix == "guo" || prefix == "bai"|| prefix == "dianpao" || prefix == "tuoguang" || prefix == "jiepao" || prefix == "buhua" || prefix == "bu") {
            var act = new cc.Sprite("res/res_mj/mjRoom/mj_btn_" + prefix + ".png");
            act.x = source.x + source.width / 2;
            act.y = source.y + source.width / 2;
            root.addChild(act, 1000);
            var duration = (prefix == "buhua") ? 1.5 : 1;
            var action = cc.sequence(cc.delayTime(duration), cc.callFunc(function () {
                act.removeAllChildren(true);
                act.removeFromParent(true);
            }))
            act.runAction(action);
        }else if(imgConfig[prefix]){
            var act1 = new cc.Sprite("res/res_mj/mjRoom/aniImg/" + imgConfig[prefix] + "_01.png");
            var act2 = new cc.Sprite("res/res_mj/mjRoom/aniImg/" + imgConfig[prefix] + "_02.png");
            act1.x = act2.x = source.x + source.width / 2;
            act1.y = act2.y = source.y + source.width / 2;
            act1.setScale(1.1);
            act2.setScale(1.1);
            act2.setOpacity(0);
            var action1 = cc.sequence(cc.spawn(cc.scaleTo(0.3,0.7),cc.fadeOut(0.3)),cc.delayTime(1),cc.callFunc(function(node){
                node.removeFromParent(true);
            }));
            var action2 = cc.sequence(cc.spawn(cc.scaleTo(0.3,0.7),cc.fadeIn(0.3)),cc.delayTime(1),cc.callFunc(function(node){
                node.removeFromParent(true);
            }));
            act1.runAction(action1);
            act2.runAction(action2);
            root.addChild(act1,1000);
            root.addChild(act2,1000);
        }else {
                if(root.getChildByTag(789)){
                    root.removeChildByTag(789, true);
                }
                ccs.armatureDataManager.addArmatureFileInfo(
                    "res/plist/" + prefix + "AM.ExportJson");
                var armature = new ccs.Armature(prefix + "AM");
                armature.x = source.x + source.width / 2;
                armature.y = source.y + source.width / 2;
                root.addChild(armature, 199, 789);
                var self = this;
                if (XPLPRoomModel.isGuCang()) {
                    armature.getAnimation().setSpeedScale(2.0);
                }
                armature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
                    if (evt == "finish") {
                        armature.getAnimation().stop();
                        armature.removeFromParent(true);
                        for (var i = 0; i < self.directList.length; i++) {
                            var dir = self.directList[i];
                            if (self["sprite" + dir]) {
                                self["sprite" + dir].visible = true;
                                self.directList.splice(i, 1);
                                i--;
                            }
                        }
                    }
                });
                armature.getAnimation().play(prefix + "AM", -1, 0);
        }
    },

    isLNMJ:function(){
        return (XPLPRoomModel.isLNMJ() || XPLPRoomModel.isThreeLNMJ() || XPLPRoomModel.isTwoLNMJ());
    },

    moveNiao:function(vo,x,y,root,i){
        var targetObject = ccui.helper.seekWidgetByName(root,"player"+XPLPRoomModel.getPlayerSeq("",XPLPRoomModel.mySeat,XPLPRoomModel.overNiaoSeats[i]));
        var bg = new cc.Sprite("res/res_mj/mjRoom/img_22.png");
        bg.anchorX=bg.anchorY=0;
        bg.x = x;
        bg.y = y;
        root.addChild(bg,999);
        var mj = new HZMahjong(XPLPAI.getDisplayVo(1,2),vo);
        mj.x = 2;
        mj.y = 1;
        bg.addChild(mj);
        var tx = targetObject.x-50;
        var ty = targetObject.y-50;
        var action = cc.sequence(cc.delayTime(2),cc.spawn(cc.moveTo(0.8,tx,ty),cc.scaleTo(0.8,0.5,0.5)),cc.callFunc(function(){
            mj.chuPai();
        }),cc.fadeTo(1,0),cc.callFunc(function(){
            bg.removeAllChildren(true);
            bg.removeFromParent(true);
        }));
        bg.runAction(action);
    },

    /**
     *
     * @param data
     * @param root
     * @param selector {function}
     * @param target {Object}
     */
    niaoAction:function(data,root){
        var source = ccui.helper.seekWidgetByName(root,"cp3");
        this.normalAction(root,"zhuaniao",source);
        var ids = XPLPRoomModel.overNiaoIds;
        if(ids.length>0){
            var winSize = cc.director.getWinSize();
            var y = winSize.height/2-45;
            var initX = (winSize.width - (60+60*(ids.length-1)))/2;
            for(var i=0;i<ids.length;i++){
                var vo = XPLPAI.getMJDef(ids[i]);
                var x = initX+i*60;
                this.moveNiao(vo,x,y,root,i);
            }
        }
    },

    chuPai:function(root,phzVo,actType,renshu,seq,oPanel,callBack,isReplay){
        this.actType = actType;
        root.visible = true;
        //创建相同卡牌来做动作
        if (oPanel && oPanel.getChildByTag(321)){
            oPanel.removeChildByTag(321);
            this.qiCard = null;
        }

        var endScale = 1;

        if(renshu == 4 || isReplay){
            endScale = 0.5;
        }

        this.phzVo = phzVo || null;

        var kuangText = "#xplp_" + phzVo.t + phzVo.n + ".png";

        var kuang = this.kuang = new cc.Sprite(kuangText);

        kuang.x = this.getOutPaiStartPos(renshu,seq,actType).x;
        kuang.y = this.getOutPaiStartPos(renshu,seq,actType).y;

        var endPos = cc.p(0 , 0);
        kuang.scale=endScale;
        kuang.setAnchorPoint(0.5,0.5);
        if(seq == 1 || (renshu == 2 && seq == 2) || (renshu == 4 && seq == 3)){
            kuang.setRotation(-90);
            endPos = cc.p(20,0);
        }
        root.addChild(kuang);

        var time = 0.1;
        var lyzpDelaytime = 0.1;
        kuang.runAction(cc.sequence(
            cc.moveTo(time,endPos),
            cc.delayTime(lyzpDelaytime),
            cc.callFunc(function(){
                if(callBack){
                    callBack();
                    callBack = null;
                }
            })
        ));
        if (oPanel){
            var kuang1 = this.qiCard = new cc.Sprite(kuangText);
            kuang1.scale = endScale;

            kuang1.y = endPos.y + ( root.y - oPanel.y );
            kuang1.x = endPos.x + ( root.x - oPanel.x );
            if (root.x < oPanel.x){ //暂时先用x坐标判断
                kuang1.x += oPanel.width;
            }
            this.qiCard.visible = false;
        }

    },


    qiPai:function(_endPos){
        if (this.qiCard){
            var time = 0.15;
            this.qiCard.visible = true;
            this.qiCard.runAction(
                cc.spawn(cc.scaleTo(time,0,0),cc.MoveTo(time,_endPos))
            )
        }
    },

    //得到出牌的初始位置 参数:座位和玩家人数
    getOutPaiStartPos:function(_num,_seq,_actType){
        var startPos = cc.p(0 , 0);
        if(_num==4){
            if (_actType == 1){
                if (_seq == 1){
                    startPos = cc.p(-85 , 90);
                }else if (_seq == 2){
                    startPos = cc.p(-415 , 90);
                }else if (_seq == 3){
                    startPos = cc.p(145 , 90);
                }else if (_seq == 4){
                    startPos = cc.p(335 , 90);
                }
            }else{
                if (_seq == 1){
                    startPos = cc.p(-85 , -30);
                }else if (_seq == 2){
                    startPos = cc.p(225 , 220);
                }else if (_seq == 3){
                    startPos = cc.p(5 , 310);
                }else if (_seq == 4){
                    startPos = cc.p(-185 , 220);
                }
            }
        }else if(_num==3){
            if (_actType == 1){
                if (_seq == 1){
                    startPos = cc.p(35 , 270);
                }else if (_seq == 2){
                    startPos = cc.p(-270 , 225);
                }else if (_seq == 3){
                    startPos = cc.p(370 , 225);
                }
            }else{
                if (_seq == 1){
                    startPos = cc.p(33 , -120);
                }else if (_seq == 2){
                    startPos = cc.p(315 , 275);
                }else if (_seq == 3){
                    startPos = cc.p(-220 , 275);
                }
            }
        }else{
            if (_actType == 1){
                if (_seq == 1){
                    startPos = cc.p(35 , 270);
                }else if (_seq == 2){
                    startPos = cc.p(370 , 225);
                }
            }else{
                if (_seq == 1){
                    startPos = cc.p(33 , -120);
                }else if (_seq == 2){
                    startPos = cc.p(-220 , 275);
                }
            }
        }
        return startPos
    },

    //得到弃牌动作出牌的初始位置 参数:座位和玩家人数
    getQiPaiStartPos:function(_num,_seq){
        var startPos = cc.p(0 , 0);
        if(_num==4){
            if (_seq == 1){
                startPos = cc.p(-230 , 185);
            }else if (_seq == 2){
                startPos = cc.p(220 , -145);
            }else if (_seq == 3){
                startPos = cc.p(-305 , -225);
            }else if (_seq == 4){
                startPos = cc.p(155 , -145);
            }
        }else if(_num==3){
            if (_seq == 1){
                startPos = cc.p(-290 , 466);
            }else if (_seq == 2){
                startPos = cc.p(12 , 298);
            }else if (_seq == 3){
                startPos = cc.p(305 , 300);
            }
        }else{
            if (_seq == 1){
                startPos = cc.p(-290 , 466);
            }else if (_seq == 2){
                startPos = cc.p(305 , 300);
            }
        }
        return startPos
    },

}
