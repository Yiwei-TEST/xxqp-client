/**
 * Created by zhoufan on 2016/7/27.6
 */
var MJRoomEffects = {
    BAO_TAG:3003,
    AN_BAO_TAG:3004,
    ALERT_TAG:3005,
    HUPAI_TAG:9999,
    ZHANGSI_TAG:8888,
    directList:[],

    normalActionForYLC:function(root,prefix,source,direct) {
        cc.log("normalActionForYLC prefix = ",prefix);
        var aniRes = "mj"+prefix;
        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/YLCMjActionAni/" + aniRes + "/" + aniRes + ".ExportJson");
        var armature = new ccs.Armature(aniRes);
        armature.x = source.x + source.width / 2;
        armature.y = source.y + source.width / 2;
        if(direct == 2){
            armature.x -= 100;
        }else if(direct ==  4){
            armature.x += 200;
        }
        armature.getAnimation().setMovementEventCallFunc(function (bone, evt) {
                if (evt == ccs.MovementEventType.complete) {
                    armature.getAnimation().stop();
                    armature.removeFromParent(true);
                }
            },this);
        armature.getAnimation().play("Animation1", -1, 0);
        root.addChild(armature, 1000);
    },
    
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
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.CQXZMJ && (prefix == "xiayu" || prefix == "guafeng")){
            var string = "gf";
            var num = 10;
            if(prefix == "xiayu"){
                AudioManager.play("res/res_mj/audio/cqxzmj/xuayu.mp3");
                string = "xy";
                num = 14;
            }else{
                AudioManager.play("res/res_mj/audio/cqxzmj/guafeng.mp3");
            }
            var shuffleAni = new AnimateSprite("res/plist/cqxzmj_"+prefix+".plist","cqxz_"+string,1/num);
            shuffleAni.x = source.x + source.width / 2;
            shuffleAni.y = source.y + source.width / 2;
            shuffleAni.setCallBack(function(){
                root.removeChildByTag(999);
            },root);
            shuffleAni.play();
            shuffleAni.runAction(cc.delayTime(0.5));
            root.addChild(shuffleAni,100,999);
        }else {
            if(MJRoomModel.isTJMJ() || MJReplayModel.wanfa == GameTypeEunmMJ.TJMJ || MJRoomModel.wanfa == GameTypeEunmMJ.YJMJ){
                var act = new cc.Sprite("res/res_mj/mjRoom/mj_btn_" + prefix + ".png");
                act.x = source.x + source.width / 2;
                act.y = source.y + source.width / 2;
                root.addChild(act, 1000);
                var duration = (prefix == "buhua") ? 1.5 : 1;
                var action = cc.sequence(cc.delayTime(duration), cc.callFunc(function () {
                    act.removeAllChildren(true);
                    act.removeFromParent(true);
                }));
                act.runAction(action);
            }else if(MJRoomModel.isTCPFMJ() || prefix == "tcpfmj_buhua"){
                var act = new cc.Sprite("res/res_mj/res_ahmj/tcmjRoom/" + prefix + ".png");
                act.x = source.x + source.width / 2;
                act.y = source.y + source.width / 2;
                root.addChild(act, 1000);
                var duration = (prefix == "tcpfmj_buhua") ? 1.5 : 1;
                var action = cc.sequence(cc.delayTime(duration), cc.callFunc(function () {
                    act.removeAllChildren(true);
                    act.removeFromParent(true);
                }));
                act.runAction(action);
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
                if (this.isLNMJ() && !isReplay && (prefix == "hu" || prefix == "zimo" || prefix == "zhangsi")) {
                    this.directList.push(direct);
                    var png = "res/res_mj/mjRoom/baijiao_" + prefix + ".png";
                    var initY = direct == 3 ? 80 : 0;
                    var sprite = this["sprite" + direct] = new cc.Sprite(png);
                    this["sprite" + direct].x = source.x + source.width / 2;
                    this["sprite" + direct].y = source.y + source.width / 2 + initY;
                    var tag = prefix == "zhangsi" ? this.ZHANGSI_TAG : this.HUPAI_TAG;
                    root.addChild(this["sprite" + direct], 500, tag + direct);
                    this["sprite" + direct].visible = false;
                }
                var self = this;
                if (MJRoomModel.isGuCang()) {
                    armature.getAnimation().setSpeedScale(2.0);
                }
                if (this.isLNMJ()) {
                    armature.getAnimation().setSpeedScale(1.8);
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
        }
    },

    isLNMJ:function(){
        return (MJRoomModel.isLNMJ() || MJRoomModel.isThreeLNMJ() || MJRoomModel.isTwoLNMJ());
    },

    moveNiao:function(vo,x,y,root,i){
        var targetObject = ccui.helper.seekWidgetByName(root,"player"+MJRoomModel.getPlayerSeq("",MJRoomModel.mySeat,MJRoomModel.overNiaoSeats[i]));
        var bg = new cc.Sprite("res/res_mj/mjRoom/img_22.png");
        bg.anchorX=bg.anchorY=0;
        bg.x = x;
        bg.y = y;
        root.addChild(bg,999);
        var mj = new HZMahjong(MJAI.getDisplayVo(1,2),vo);
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
        var ids = MJRoomModel.overNiaoIds;
        if(ids.length>0){
            var winSize = cc.director.getWinSize();
            var y = winSize.height/2-45;
            var initX = (winSize.width - (60+60*(ids.length-1)))/2;
            for(var i=0;i<ids.length;i++){
                var vo = MJAI.getMJDef(ids[i]);
                var x = initX+i*60;
                this.moveNiao(vo,x,y,root,i);
            }
        }
    }

}
