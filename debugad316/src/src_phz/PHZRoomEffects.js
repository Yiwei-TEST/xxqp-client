/**
 * Created by zhoufan on 2016/11/11.
 */
var PHZRoomEffects = {

    getSprite:function(texture){
        var frame = cc.spriteFrameCache.getSpriteFrame(texture);
        if(!frame){
            cc.log("PHZRoomEffects texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("#"+texture);
    },

    chuPai:function(root,phzVo,actType,renshu,seq,oPanel,callBack){
        this.actType = actType;
        root.visible = true;
        //创建相同卡牌来做动作
        if (oPanel && oPanel.getChildByTag(321)){
            oPanel.removeChildByTag(321);
            this.qiCard = null;
        }
        var pmType = PHZSetModel.pmxz;

        var endScale = 1.4;
        this.phzVo = phzVo || null;
        var kuangText = "#big_face"+pmType+".png";
        if(phzVo.c == 0){
            kuangText = "#cards_back.png";
            if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ)
                kuangText = "#yzchz_bg_cp.png";
        }
        

        var per = 0.2;
        var kuang =  this.kuang = new cc.Sprite(kuangText);
        if (phzVo.c != 0){
            var kuangBgtext = (actType==1)?"res/res_phz/mo.png":"res/res_phz/da.png";
            if(PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ||PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ){//安化跑胡子换一个
                kuangBgtext = (actType==1)?"res/res_phz/ahmo.png":"res/res_phz/ahda.png";
            }
            var kuangBg = new cc.Sprite(kuangBgtext);
            kuang.addChild(kuangBg);
            kuangBg.x = kuang.width/2;
            kuangBg.y = kuang.height/2;
        }
        var endPosX = 0;
        var endPosY = 0;
        if(renshu==4){
            endPosX = 200;
            endPosY = 81;
        }else{
            endPosX = 200;
            endPosY = 121;
        }
        // kuang.x = this.getOutPaiStartPos(renshu,seq,actType).x;
        // kuang.y = this.getOutPaiStartPos(renshu,seq,actType).y;
        kuang.x = PHZRoomModel.isSelfOutCard?PHZRoomModel.outCardsX - root.x:this.getOutPaiStartPos(renshu,seq,actType).x;
        kuang.y = PHZRoomModel.isSelfOutCard?PHZRoomModel.outCardsY - root.y:this.getOutPaiStartPos(renshu,seq,actType).y;
        if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            endPosX = 60;
            endPosY = 100;
        }

        if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            if(actType == 1){
                if(seq == 1){
                    kuang.x = 0;
                    kuang.y = 0;
                }else if(seq == 2){
                    kuang.x = -200;
                    kuang.y = -20;
                }else if(seq == 3){
                    kuang.x = 200;
                    kuang.y = -20;
                }
            }else if(actType == 2){
                if(seq == 1){
                    kuang.x = -550;
                    kuang.y = -350;
                }else if(seq == 2){
                    kuang.x = 300;
                    kuang.y = 150;
                }else if(seq == 3){
                    kuang.x = -550;
                    kuang.y = 100;
                }
            }
            endPosX = 0;
            endPosY = 0;
        }

        if(PHZRoomModel.renshu == 2 && PHZRoomModel.wanfa ==  GameTypeEunmZP.LDFPF){ 
            if (seq == 2){
                kuang.x = 650;
                kuang.y = 220;
                if(actType != 1){
                    kuang.x = -200 - (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
                }
            }else{
                kuang.x = -300;
                kuang.y = 220;
            }
           

        }

        PHZRoomModel.isSelfOutCard = false;
        var endPos = cc.p(endPosX , endPosY);
        kuang.scale=0.1;
        root.addChild(kuang);
        var ziScale = 0.8;
        var png = "cards_back.png";
        if(phzVo.c>0){
            png = this.getPaiPngurl(phzVo);
            var bg1 = this.bg1 = this.getSprite(png);
            bg1.x = kuang.width/2;
            bg1.y = kuang.height*per;
            bg1.setFlippedY(-180);
            bg1.setFlippedX(-180);
            bg1.scale = ziScale;
            kuang.addChild(bg1);

            //cc.log("kuang.width",kuang.width,kuang.height)
            var bg = this.bg = this.getSprite(png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-per);
            bg.scale = ziScale;
            kuang.addChild(bg);
        }

        //var worldPos = root.convertToWorldSpace(kuang.getPosition());

        var time = 0.1;
        //var time = 0.08 + (PHZSetModel.cpsd-1)*0.03;
        var lyzpDelaytime = 0;
        if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP || PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF
            || PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
            // lyzpDelaytime = 0.2;
            lyzpDelaytime = 0.1 * PHZSetModel.cpsd;
        }
        kuang.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(time,endScale,endScale),
            cc.MoveTo(time,endPos)),
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
            kuang1.x = endPos.x + ( root.x - oPanel.x );// + oPanel.width;
            if (root.x < oPanel.x){ //暂时先用x坐标判断
                kuang1.x += oPanel.width;
            }
            // kuang1.y = this.kuang.y;
            // kuang1.x = this.kuang.x;
            //cc.log("this.getQiPaiStartPos==="+this.getQiPzaiStartPos(renshu,seq,actType).x + "---" + this.getQiPaiStartPos(renshu,seq,actType).y)
            oPanel.addChild(kuang1,1,321);
            //cc.log("png=========="+png)
            if(phzVo.c>0){
                var bg1 = this.getSprite(png);
                bg1.x = kuang.width/2;
                bg1.y = kuang.height*per;
                bg1.setFlippedY(-180);
                bg1.setFlippedX(-180);
                bg1.scale = ziScale;
                kuang1.addChild(bg1);
            }

            var bg = this.getSprite(png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-per);
            bg.scale = ziScale;
            kuang1.addChild(bg);
            this.qiCard.visible = false;
        }
        //kuang.runAction(cc.scaleTo(0.15,1.3,1.3));
    },


    qiPai:function(_endPos){
        if (this.qiCard){
            var time = 0.15;
            //var time = 0.08 + (PHZSetModel.cpsd-1)*0.03;
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


    getPaiPngurl:function(phzVo){
        var t = phzVo.t==1 ? "s" : "b";
        var paiType = PHZSetModel.zpxz==3?3:1;
        var png = "big_cards" + paiType + "_" + phzVo.n + t + ".png";
        return png
    },

    refreshCardByOpenTex:function() {
        if (this.bg && this.phzVo){
            var color = this.phzVo.t == 1 ? "s" : "b";
            var number = this.phzVo.n;
            var paiType = PHZSetModel.zpxz==3?3:1;
            var pngName = "big_cards" + paiType + "_" + number + color + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(pngName);
            this.bg.setSpriteFrame(frame);
        }else{
            //cc.log("this.phzVo.n::"+this.phzVo.n)
            //cc.log("this.phzVo.t::"+this.phzVo.t)
        }

        if (this.bg1 && this.phzVo){
            var color = this.phzVo.t == 1 ? "s" : "b";
            var number = this.phzVo.n;
            var paiType = PHZSetModel.zpxz==3?3:1;
            var pngName = "big_cards" + paiType + "_" + number + color + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(pngName);
            this.bg1.setSpriteFrame(frame);
        }

    },
    refreshCardBgByOpenTex:function(){
        if(this.kuang){
            var pmType = PHZSetModel.pmxz;
            var kuangText = "big_face"+pmType+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(kuangText);
            this.kuang.setSpriteFrame(frame);
        }
    },
    huPai:function(root,direct,renshu){
        var armature = new cc.Sprite("res/res_phz/hu_1.png");
        armature.scale = 1.5;
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = (renshu==4) ? 757 : 802;
            if(renshu==2 && PHZRoomModel.wanfa != GameTypeEunmZP.AHPHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YJGHZ && PHZRoomModel.wanfa != GameTypeEunmZP.NXGHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YYWHZ){
                armature.x = 412;
                armature.y = 802;
            }
        }else if(direct==3){
            if(renshu==4){
                armature.x = 960;
                armature.y = 802;
            }else{
                armature.x = 412;
                armature.y = 802;
            }
        }else if(direct==4){
            armature.x = 412;
            armature.y = 757;
        }
        root.addChild(armature,999);
        armature.setName("Hu_armature");
        armature.runAction(cc.sequence(cc.scaleTo(2,2.25,2.25),cc.delayTime(0.6),cc.fadeTo(0.5,0),cc.callFunc(function(){
        	armature.removeFromParent(true);
        })));
    },
    cleanhuPai:function (root) {
        var huAni = root.getChildByName("Hu_armature");
        if(huAni){
            huAni.stopAllActions();
            huAni.removeFromParent(true);
            huAni = null;
        }
    },
    huangzhuang:function(root){
    	var huangImg = "res/res_phz/huang.png";
    	var huang = new cc.Sprite(huangImg);
    	huang.x = 960;
    	huang.y = 540;
    	root.addChild(huang,3);
    	huang.runAction(cc.sequence(cc.scaleTo(1,1.5,1.5),cc.delayTime(1),cc.fadeTo(0.5,0),cc.callFunc(function(){
    		huang.removeFromParent(true);
    	})));
    },

    normalActionForYLC:function(prefix,root,direct,renshu){
        var actionAniRes = "zipai"+prefix;
        if(prefix == "qin"){
            actionAniRes = "zipaiqing";
        }
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/YLCPHZActionAni/"+actionAniRes+"/"
                        +actionAniRes+".ExportJson");
        var armature = new ccs.Armature(actionAniRes);
        armature.getAnimation().setMovementEventCallFunc(function (bone, evt) {
            if (evt == ccs.MovementEventType.complete) {
                armature.getAnimation().stop();
                armature.removeFromParent(true);
            }
        },this);
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = (renshu==4) ? 757 : 802;
            if(renshu==2 && PHZRoomModel.wanfa != GameTypeEunmZP.AHPHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YJGHZ
                && PHZRoomModel.wanfa != GameTypeEunmZP.NXGHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YYWHZ){
                armature.x = 412;
                armature.y = 802;
            }
        }else if(direct==3){
            if(renshu==4){
                armature.x = 960;
                armature.y = 802;
            }else{
                armature.x = 412;
                armature.y = 802;
            }
        }else if(direct==4){
            armature.x = 412;
            armature.y = 757;
        }
        root.addChild(armature,999);
        armature.getAnimation().play("Animation1", -1, 0);
    },

    normalAction:function(prefix,root,direct,renshu){
    	var armature = new cc.Sprite("res/res_phz/"+prefix+"_1.png");
        armature.scale = 1.5;
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = (renshu==4) ? 757 : 802;
            if(renshu==2 && PHZRoomModel.wanfa != GameTypeEunmZP.AHPHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YJGHZ
                && PHZRoomModel.wanfa != GameTypeEunmZP.NXGHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YYWHZ){
                armature.x = 412;
                armature.y = 802;
            }
        }else if(direct==3){
        	if(renshu==4){
        		armature.x = 960;
        		armature.y = 802;
        	}else{
        		armature.x = 412;
        		armature.y = 802;
        	}
        }else if(direct==4){
        	armature.x = 412;
        	armature.y = 757;
        }
        root.addChild(armature,999);

        armature.runAction(cc.sequence(cc.scaleTo(0.2,2.25,2.25),cc.delayTime(0.2),cc.fadeTo(0.5,0),cc.callFunc(function(){
        	armature.removeFromParent(true);
        })));
    },

    chiAnimate:function(ids,root,direct,callback,action,burCount){
        burCount = burCount || 0;
        var layout = PHZRoomModel.mineRoot.layouts[direct];
        if((PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ && action==PHZAction.WEI) || (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ && PHZRoomModel.intParams[16] == 0 && action==PHZAction.WEI)
            || (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK && PHZRoomModel.intParams[36] == 0 && (action==PHZAction.WEI || action==PHZAction.TI))
            || (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ && PHZRoomModel.intParams[13] == 0 && (action==PHZAction.WEI || action==PHZAction.TI))
	        || (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ && action == 18)
            || (PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ && action==PHZAction.WEI)
            || (PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ && action==PHZAction.WEI)
            || (PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW && action==PHZAction.WEI)){
            var temp = [0,0,0,0];
            ids = temp.slice(0,ids.length);
        }
        var voArray = PHZAI.getVoArray(ids);
        var coords = null;

        var diffY = 50;
        var diffX = 50;

        var beginY1 = 765;//
        var beginY2 = 796;//
        var beginY3 = 796;//
        var beginY4 = 0;//
        if(PHZRoomModel.renshu == 4){
            beginY1 = 635;//
            beginY2 = 635;//
            beginY3 = 957;//
            beginY4 = 635;//
        }


        if(PHZRoomModel.renshu==4){
            //coords = {1:{x:260,y:beginY1},2:{x:920,y:beginY2},3:{x:1020,y:beginY3},4:{x:260,y:beginY4}};
            coords = {1:{x:1374,y:beginY1},2:{x:1518,y:beginY2},3:{x:1177,y:beginY3},4:{x:40,y:beginY4}};
        }else if(PHZRoomModel.renshu==3){
            coords = {1:{x:1255,y:beginY1},2:{x:1470,y:beginY2},3:{x:450,y:beginY2}};
        }else{
            coords = {1:{x:1255,y:beginY1},2:{x:450,y:beginY2}};
        }

        var initStarX = [805,0];
        if (PHZRoomModel.renshu == 4){
            //initStarX = [0,1177,1280,0];
            initStarX = [984,1908,787,22]
        }else if(PHZRoomModel.renshu==3){
            //initStarX = [0,1177,1280,0];
            initStarX = [805,SyConfig.DESIGN_WIDTH,0];
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            beginY1 = 472;beginY2 = beginY3 = 660;
            coords = {1:{x:585,y:beginY1},2:{x:1470,y:beginY2},3:{x:585,y:beginY2}};
            initStarX = [135,SyConfig.DESIGN_WIDTH,135];
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            beginY1 = 433;beginY2 = beginY3 = 779;
            if(PHZRoomModel.renshu==3){
                coords = {1:{x:510,y:beginY1},2:{x:1470,y:beginY2},3:{x:510,y:beginY2}};
                initStarX = [60,1900,60];
            }else{
                coords = {1:{x:510,y:beginY1},2:{x:510,y:beginY2}};
                initStarX = [60,60];
            }
        }
        var container = new cc.Sprite();
        container.setContentSize(voArray.length/3*48,534);
        var count = 0;
        var mod = ids.length % 3 != 0 ? 4 : 3;
        var cardScale = 1;
        var initY = (mod + 1) * diffY * cardScale;//mod * 35 * cardScale

        var voList = [];
        var cardsList = [];

        //cc.log("voArray.length ..." , voArray.length);
        while(voArray.length>0){
            var array = voArray.splice(0,mod);
            //cc.log("array.length ..." , array.length);
            for(var i=0;i<array.length;i++){
                var vo = array[i];
                var phz = new PHZCard(PHZAI.getDisplayVo(1,2),vo);
                phz.scale = cardScale;
                //phz.anchorX = phz.anchorY = 0;
                phz.x = count*(diffX * phz.scale + 1);
                phz.y = initY - i * diffY * cardScale;
                //cc.log("phz.x.y",phz.y,phz.x)
                //cc.log("phz.height*1.3... phz.width * cardScale ..." , phz.height * cardScale , phz.width * cardScale);
                container.addChild(phz);
                voList.push(vo);
                cardsList.push(phz);

            }
            count++;
        }
        this.specialDeal(cardsList ,voList , action,direct);
        container.x = coords[direct].x;
        container.y = coords[direct].y;
        //container.scale=0.5;
        root.addChild(container,998);
        var x1 = layout.place2x;
        if(direct==1){
            cc.log("my contain width ..." , container.width );
            x1 = x1 < 0 ? 0 : x1;
            if(PHZRoomModel.renshu == 4){
                x1 = x1 + initStarX[0] + container.width * 0.5;
            }else{
                x1 = x1 + initStarX[0] + container.width/2;
            }
        }else if(direct==2){
            x1 = x1 < 0 ? 0 : x1;
            if(PHZRoomModel.renshu == 2 && PHZRoomModel.wanfa != GameTypeEunmZP.AHPHZ && PHZRoomModel.wanfa != GameTypeEunmZP.YJGHZ
                && PHZRoomModel.wanfa != GameTypeEunmZP.NXGHZ && PHZRoomModel.wanfa != GameTypeEunmZP.NXGHZ){
                x1 = x1+initStarX[1] +container.width/2;
            }else{
                x1 = initStarX[1]-x1-container.width/2;
            }
        }else if(direct == 3){
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1+initStarX[2] +container.width/2;
        }else{
            //if(PHZRoomModel.renshu==4 && direct==3){
            //    x1 = x1 < 0 ? 0 : x1;
            //    //x1 = x1+521+container.width/2;
            //    x1 = initStarX[2] - x1 - container.width/2;
            //    cc.log("四人玩法 第三个位置的计算 ..." , x1)
            //}else{
            //    x1 = x1 < 0 ? 0 : x1;
            //    x1 = x1 + 8 + container.width/2;
            //}
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1 + 8 + container.width/2;
        }
        //cc.log("phz move to X...." , x1 + " " + layout.place2x + "Direct " + direct);
        if(PHZRoomModel.renshu==4){
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2},3:{x:x1,y:beginY3},4:{x:x1,y:beginY4}};
        }else if(PHZRoomModel.renshu==3){
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2},3:{x:x1,y:beginY2}};
        }else{
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2}};
        }

        var t1 = 0.35;//停顿速度
        var t2 = 0.08;//动作基础值
        var t3 = 0.01;//延时回调


        //动作时间
        if (PHZSetModel.cpsd){
            // t2 = t2 + (PHZSetModel.cpsd-1)*0.10
            t2 = t2 + 0.10
            if (PHZRoomModel.wanfa ==  GameTypeEunmZP.HYSHK){
                t2 = t2 + (PHZSetModel.cpsd-1)*0.12
            }
        }

        container.runAction(cc.sequence(
        		//cc.delayTime(t1),
        		cc.spawn(cc.moveTo(t2
                    ,coords1[direct].x,coords1[direct].y)),
        		cc.delayTime(t3),
        		cc.callFunc(function(){
        			container.removeFromParent(true);
        			if(callback)
        				callback(burCount);
        		})
        ));
    },

    //新增将生成的要执行运动的卡牌 增加背面 灰色 等特殊显示
    specialDeal:function(cardObjs , innerArray ,innerAction,direct){
        for(var j=0;j<innerArray.length;j++) {
            var card = cardObjs[j];
            var innerVo = innerArray[j];
            switch (innerAction){
                case PHZAction.WEI://偎
                    if(PHZRoomModel.wanfa==38){
                        if(this.direct==1){
                            innerVo.as = 1;
                        }else{
                            innerVo.a = 1;
                        }
                    }else{
                        innerVo.a = 0;
                        innerVo.as = 0;
                        if(j>0)
                            innerVo.a=1;
                    }

                    if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && direct != 1){
                        innerVo.a = 1;
                    }

                    break;
                case PHZAction.CHOU_WEI://臭偎
                    innerVo.a = 0;
                    innerVo.as = 0;
                    if(j>0)
                        innerVo.a=1;
                    break;
                case PHZAction.TI://提
                    innerVo.a = 0;
                    innerVo.as = 0;
                    if(j>0)
                        innerVo.a=1;

                    if((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && direct != 1){
                        innerVo.a = 1;
                    }

                    break;
                case PHZAction.CHI://吃
                    if(j==0)
                        innerVo.zhe=1;
                    break;
                case PHZAction.PAO://跑
                    innerVo.as = innerVo.a = 0;
                    break;
            }
            card.refresh(PHZAI.getDisplayVo(1,2) , innerVo , innerAction);
        }

    },

    /**
     * 庄家摸的最后一张
     * @param root
     * @param phzVo
     * @param seat
     */
    showZhuangLastCard:function(root,phzVo,seat){
        root.visible = true;
        var kuang = this.createCard(root,phzVo);
        kuang.runAction(cc.sequence(cc.scaleTo(0.8,1.2,1.2),cc.delayTime(0.8),cc.fadeTo(0.2,0),cc.callFunc(function(){
            root.removeAllChildren(true);
        })));
    },

    /**
     * 创建牌
     * @param root
     * @param phzVo
     * @returns {*}
     */
    createCard:function(root,phzVo){
        var pmType = PHZSetModel.pmxz;
        var kuangImg = phzVo.c ==0?"#yzchz_bg_cp.png":"#big_face"+pmType+".png";
        var kuang = new cc.Sprite(kuangImg);
        if(PHZRoomModel.renshu==4){
            kuang.x = 33;
            kuang.y = 81;
        }else{
            kuang.x = 33;
            kuang.y = 121;
        }
        kuang.scale=0.1;
        root.addChild(kuang);
        var png = "cards_back.png";
        if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ)
            png = "yzchz_bg_cp.png";
        var ziScale = 0.8;
        if(phzVo.c>0){
            png = this.getPaiPngurl(phzVo);
            var bg1 = this.getSprite(png);
            bg1.x = kuang.width/2;
            bg1.y = kuang.height*0.22;
            bg1.setFlippedY(-180);
            bg1.setFlippedX(-180);
            bg1.scale = ziScale;
            kuang.addChild(bg1);

            var bg = this.getSprite(png);
            bg.x = kuang.width/2;
            bg.y = kuang.height*(1-0.22);
            bg.scale = ziScale;
            kuang.addChild(bg);
        }
        return kuang; 
    },

    createGLZPCard:function(root,phzVo,isHui){
        var paiType = PHZSetModel.zpxz ==3?3:1;
        var pmType = PHZSetModel.pmxz;
        var png = "big_face"+pmType+".png";
        var t = phzVo.t==1 ? "s" : "b";
        var ziPNG = "big_cards" + paiType + "_" + phzVo.n + t + ".png";
        var bg = this.getSprite(png);
        if(PHZRoomModel.renshu==4){
            bg.x = 33;
            bg.y = 81;
        }else{
            bg.x = 33;
            bg.y = 121;
        }
        root.addChild(bg);
        var ziS = this.getSprite(ziPNG);
        var ziX = this.getSprite(ziPNG);
        ziS.x = bg.width/2;
        ziS.y = bg.height/2 + 50;
        ziS.scale = 0.8;
        ziX.x = bg.width/2;
        ziX.y = bg.height/2 - 50;
        ziX.scale = 0.8;
        ziX.setFlippedY(-180);
        ziX.setFlippedX(-180);
        if(isHui){
            ziS.opacity = 150;
            ziX.opacity = 150;
            bg.opacity = 150;
        }
        bg.addChild(ziS);
        bg.addChild(ziX);
        return bg;
    }
}