/**
 * Created by Administrator on 2019/11/15.
 */
var HBGZPRoomEffects = {

    getSprite:function(texture){
        var frame = cc.spriteFrameCache.getSpriteFrame(texture);
        if(!frame){
            cc.log("PHZRoomEffects texture::"+texture+" is not exist!!!");
        }
        return new cc.Sprite("res/res_phz/res_hbgzp/cards/"+texture);
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
            endScale = 0.6;
        }

        this.phzVo = phzVo || null;

        var paiType = 3;//HBGZPSetModel.zpxz == 2 ? 2 : 3;
        var kuangText = "res/res_phz/res_hbgzp/cards/normal_card_" + paiType + "_" + phzVo.n + ".png";
        if(phzVo.hua == 1){
            kuangText = "res/res_phz/res_hbgzp/cards/normal_card_"+ paiType + "_" + phzVo.n + "_1.png";
        }
        var kuang = this.kuang = new cc.Sprite(kuangText);

        kuang.x = this.getOutPaiStartPos(renshu,seq,actType).x;
        kuang.y = this.getOutPaiStartPos(renshu,seq,actType).y;

        var endPos = cc.p(0 , 0);
        kuang.scale=endScale;
        if(seq == 1 || (HBGZPRoomModel.renshu == 4 && seq == 3)){// || (HBGZPRoomModel.renshu == 2 && seq == 2)
            kuang.setAnchorPoint(0.5,0.5);
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

    refreshCardByOpenTex:function() {
        this.refreshCardBgByOpenTex();
    },
    refreshCardBgByOpenTex:function(){
        if(this.kuang){
            var kuangText = "res/res_phz/res_hbgzp/card_bg" + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(kuangText);
            if(!frame){
                frame = new cc.Sprite(kuangText);
            }
            this.kuang.setSpriteFrame(frame);
        }
    },
    huPai:function(root,direct,renshu,isReplay){
        var path = "res/res_phz/res_hbgzp/action_hu.png";
        var armature = new cc.Sprite(path);
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = (renshu==4) ? 757 : 802;
            if(isReplay && renshu==2){
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
        armature.runAction(cc.sequence(cc.scaleTo(2,1.5,1.5),cc.delayTime(0.6),cc.fadeTo(0.5,0),cc.callFunc(function(){
            armature.removeFromParent(true);
        })));
    },

    huangzhuang:function(root){
        var huangImg = "res/res_phz/huang.png";
        var huang = new cc.Sprite(huangImg);
        huang.x = 960;
        huang.y = 540;
        root.addChild(huang,3);
        huang.runAction(cc.sequence(cc.scaleTo(1,1,1),cc.delayTime(1),cc.fadeTo(0.5,0),cc.callFunc(function(){
            huang.removeFromParent(true);
        })));
    },

    normalAction:function(prefix,root,direct,renshu,isReplay){
        var path = "res/res_phz/res_hbgzp/action_"+prefix+".png";
        var armature = new cc.Sprite(path);
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = (renshu==4) ? 757 : 802;
            if(isReplay && renshu==2){
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

        armature.runAction(cc.sequence(cc.scaleTo(0.2,1.5,1.5),cc.delayTime(0.2),cc.fadeTo(0.5,0),cc.callFunc(function(){
            armature.removeFromParent(true);
        })));
    },

    chiAnimate:function(ids,root,direct,callback,action,burCount){
        burCount = burCount || 0;
        var layout = HBGZPRoomModel.mineRoot.layouts[direct];

        var voArray = HBGZPAI.getVoArray(ids);
        var coords = null;
        var coords1 = null;

        var diffY = 50;
        var diffX = 50;

        var beginY1 = 765;//
        var beginY2 = 796;//
        var beginY3 = 796;//
        var beginY4 = 0;//
        if(HBGZPRoomModel.renshu == 4){
            beginY1 = 635;//
            beginY2 = 635;//
            beginY3 = 957;//
            beginY4 = 635;//
        }


        if(HBGZPRoomModel.renshu==4){
            //coords = {1:{x:916,y:beginY1},2:{x:1012,y:beginY2},3:{x:785,y:beginY3},4:{x:275,y:beginY4}};
            coords = {1:{x:1374,y:beginY1},2:{x:1518,y:beginY2},3:{x:1177,y:beginY3},4:{x:40,y:beginY4}};
        }else if(HBGZPRoomModel.renshu==3){
            //coords = {1:{x:837,y:beginY1},2:{x:980,y:beginY2},3:{x:300,y:beginY2}};
            coords = {1:{x:1255,y:beginY1},2:{x:1470,y:beginY2},3:{x:450,y:beginY2}};
        }else{
            //coords = {1:{x:837,y:beginY1},2:{x:1012,y:beginY2}};
            coords = {1:{x:1255,y:beginY1},2:{x:1470,y:beginY2}};
        }

        var initStarX = [537,0];
        if (HBGZPRoomModel.renshu == 4){
            //initStarX = [0,1177,1280,0];
            initStarX = [656,1272,525,15]
        }else if(HBGZPRoomModel.renshu==3){
            //initStarX = [0,1177,1280,0];
            initStarX = [537,1280,0];
        }


        var container = new cc.Sprite();
        container.setContentSize(voArray.length/3*40,356);
        var count = 0;
        var mod = ids.length % 3 != 0 ? 4 : 3;
        var cardScale = 0.4;
        var initY = (mod + 1) * diffY * cardScale;//mod * 35 * cardScale

        var voList = [];
        var cardsList = [];

        while(voArray.length>0){
            var array = voArray.splice(0,mod);
            for(var i=0;i<array.length;i++){
                var vo = array[i];
                var phz = new HBGZPCard(HBGZPAI.getDisplayVo(1,2),vo);
                phz.scale = cardScale;
                phz.x = count*(diffX * phz.scale + 1);
                phz.y = initY - i * diffY * cardScale;
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
            // cc.log("my contain width ..." , container.width );
            x1 = x1 < 0 ? 0 : x1;
            if(HBGZPRoomModel.renshu == 4){
                x1 = x1 + initStarX[0] + container.width * 0.5;
            }else{
                x1 = x1 + initStarX[0] + container.width/2;
            }
        }else if(direct==2){
            x1 = x1 < 0 ? 0 : x1;
            if(HBGZPRoomModel.renshu == 2){
                x1 = x1+initStarX[1] +container.width/2;
            }else{
                x1 = initStarX[1]-x1-container.width/2;
            }
        }else if(direct == 3){
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1+initStarX[2] +container.width/2;
        }else{
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1 + 8 + container.width/2;
        }
         cc.log("phz move to X...." , x1 + " " + layout.place2x + " Direct " + direct);
        if(HBGZPRoomModel.renshu==4){
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2},3:{x:x1,y:beginY3},4:{x:x1,y:beginY4}};
        }else if(HBGZPRoomModel.renshu==3){
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2},3:{x:x1,y:beginY2}};
        }else{
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2}};
        }

        var t1 = 0.35;//停顿速度
        var t2 = 0.08;//动作基础值
        var t3 = 0.01;//延时回调


        //动作时间
        if (HBGZPSetModel.cpsd){
            t2 = t2 + (HBGZPSetModel.cpsd-1)*0.10;
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
            card.refresh(HBGZPAI.getDisplayVo(1,2) , innerVo , innerAction);
        }

    }

}