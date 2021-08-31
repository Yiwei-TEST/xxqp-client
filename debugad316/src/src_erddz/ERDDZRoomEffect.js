/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZRoomEffect = cc.Class.extend({
    ctor:function(){
        cc.log("========ERDDZRoomEffect====ctor===");
    },

    handleTableData:function(type,data,root,seq){
        var aniName = "";
        if(type == ERDDZTabelType.PlayCard){
            if(data.cardType == 0){
                var typeData = ERDDZRoomModel.getCardTypeData(data.cardIds);
                if(typeData.type == ERDDZCardType.ShunZi){
                    aniName = "shunzide";
                }else if(typeData.type == ERDDZCardType.LianDui){
                    aniName = "lianduide";
                }else if(typeData.type == ERDDZCardType.SanZhang){
                    aniName = "sandui";
                }else if(typeData.type == ERDDZCardType.SanDaiYi){
                    aniName = "sandaiyi";
                }else if(typeData.type == ERDDZCardType.SanDaiDui){
                    aniName = "sandaidui";
                }else if(typeData.type == ERDDZCardType.FeiJi || typeData.type == ERDDZCardType.FeiJiDCB) {
                    aniName = "feijide";
                }else if(typeData.type == ERDDZCardType.ZhaDan){
                    aniName = "baozhade";
                }else if(typeData.type == ERDDZCardType.TianZha){
                    aniName = "wangzha";
                    this.showWangZhaAni(root,seq);
                    return;
                }
            }
        }else if(type == ERDDZTabelType.OnOver){
            // 春天
            // data.closingPlayers[0].ext[3] == 1 春天
            // data.closingPlayers[0].ext[3] == 2 反春天
            if(data.closingPlayers[0].ext[3] == 1 || data.closingPlayers[0].ext[3] == 2){
                aniName = "paodekuaichuntian";
            }
        }
        if(aniName != ""){
            this.showAni(aniName,root,seq)
        }
    },

    showAni:function(str,root,seq) {
        var _pos = {"x":0,"y":0};
        if(seq == 1){
            _pos.x = cc.winSize.width/2 + 70;
            _pos.y = cc.winSize.height/2 - 70;
        }else if(seq == 3){
            _pos.x = cc.winSize.width/2 + 70;
            _pos.y = cc.winSize.height/2 + 200;
        }
        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/DDZAni/" + str + "/" + str + ".ExportJson");
        var armature = new ccs.Armature(str);
        armature.x = _pos.x;
        armature.y = _pos.y;
        if(str == "feijide"){
            armature.x = 0;
            armature.y = cc.winSize.height/2 + 100;
        }else if(str == "paodekuaichuntian"){
            armature.x = cc.winSize.width/2;
            armature.y = cc.winSize.height/2;
        }else if(str == "baozhade"){
            armature.x -= 120;
            armature.y -= 80;
        }
        root.addChild(armature,1000);
        armature.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == ccs.MovementEventType.complete) {
                armature.getAnimation().stop();
                armature.removeFromParent(true);
            }
        },this);
        armature.getAnimation().play("Animation1", -1, 0);
        if(str == "feijide"){
            var controlPoints2 = [ cc.p(-10, _pos.y),
                                cc.p(cc.winSize.width/2+600, _pos.y-200), 
                                cc.p(cc.winSize.width, cc.winSize.height)];
            var bezierTo1 = cc.bezierTo(2, controlPoints2);
            armature.runAction(bezierTo1);
            ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/DDZAni/feijide2/feijide2.ExportJson");
            var armature2 = new ccs.Armature("feijide2");
            armature2.x = _pos.x;
            armature2.y = _pos.y;
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

    showWangZhaAni:function(root,seq) {
        var _pos = {"x":0,"y":0};
        if(seq == 1){
            _pos.x = cc.winSize.width/2;
            _pos.y = cc.winSize.height/2;
        }else if(seq == 3){
            _pos.x = cc.winSize.width/2;
            _pos.y = cc.winSize.height/2 + 250;
        }
        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/DDZAni/paodekuaibaozhaxiaoguo2/paodekuaibaozhaxiaoguo2.ExportJson");
        var armature2 = new ccs.Armature("paodekuaibaozhaxiaoguo2");
        armature2.x = _pos.x;
        armature2.y = _pos.y;
        armature2.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == ccs.MovementEventType.complete) {
                armature2.getAnimation().stop();
                armature2.removeFromParent(true);
            }
        },this);
        root.addChild(armature2,1000);

        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/DDZAni/paodekuaibaozhaxiaoguo1/paodekuaibaozhaxiaoguo1.ExportJson");
        var armature1 = new ccs.Armature("paodekuaibaozhaxiaoguo1");
        armature1.x = cc.winSize.width/2;
        armature1.y = _pos.y;
        armature1.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == ccs.MovementEventType.complete) {
                armature2.getAnimation().play("Animation1", -1, 0);
                armature1.getAnimation().stop();
                armature1.removeFromParent(true);
            }
        },this);
        root.addChild(armature1,1000);
        armature1.getAnimation().play("Animation1", -1, 0);
    },  

    showHuoJianAni:function(root){
        ccs.armatureDataManager.addArmatureFileInfo(
                    "res/bjdani/DDZAni/paodekuaibaozhaxiaoguo3/paodekuaibaozhaxiaoguo3.ExportJson");
        var armature = new ccs.Armature("paodekuaibaozhaxiaoguo3");
        armature.x = cc.winSize.width/2;
        armature.y = 0;
        root.addChild(armature,1000);
        armature.setName("huojian");
        armature.getAnimation().play("Animation1", -1, -1);
    },
});

