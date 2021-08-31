/**
 * Created by zhoufan on 2016/11/11.
 */
var XPPHZRoomEffects = {

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
        var pmType = null;
        var endScale = 1;
        this.phzVo = phzVo || null;
        if(this.phzVo.c <= 40){//小一到小十
            if(this.phzVo.c <= 20){
                pmType = "ht";//黑桃花色
            }else{
                pmType = "mh";//梅花花色
            }
        }else{//大一到大十
            if(this.phzVo.c <= 60){
                pmType = "hx";//红心花色
            }else{
                pmType = "fk";//方块花色
            }
        }
        var t = this.phzVo.t == 1 ? "s" : "b";
        var kuangText = "big_cards_" + pmType + "_" + this.phzVo.n + t + ".png";
        if(phzVo.c == 0){
            kuangText = "xpphz_cards_back.png";
        }
        // cc.log("kuangText =",kuangText);
        var kuang =  this.kuang = this.getSprite(kuangText);
        if (phzVo.c != 0 && actType == 1){
            var kuangBgtext = "res/res_phz/xpphz/da.png";
            var kuangBg = new cc.Sprite(kuangBgtext);

            kuang.addChild(kuangBg);
            kuangBg.x = kuang.width/2;
            kuangBg.y = kuang.height/2; 
        }

        var endPosX = 200;
        var endPosY = 121;
        kuang.x = PHZRoomModel.isSelfOutCard?PHZRoomModel.outCardsX - root.x:this.getOutPaiStartPos(renshu,seq,actType).x;
        kuang.y = PHZRoomModel.isSelfOutCard?PHZRoomModel.outCardsY - root.y:this.getOutPaiStartPos(renshu,seq,actType).y;
        PHZRoomModel.isSelfOutCard = false;
        var endPos = cc.p(endPosX , endPosY);
        kuang.scale=0.1;
        root.addChild(kuang);
        var time = 0.1;
        kuang.runAction(cc.sequence(cc.spawn(cc.scaleTo(time,endScale,endScale),cc.MoveTo(time,endPos)),
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
            oPanel.addChild(kuang1,1,321);
            this.qiCard.visible = false;
        }
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
        if(_num==3){
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
                    startPos = cc.p(-270 , 225);
                }
            }else{
                if (_seq == 1){
                    startPos = cc.p(33 , -120);
                }else if (_seq == 2){
                    startPos = cc.p(315 , 275);
                }
            }
        }
        return startPos
    },

    //得到弃牌动作出牌的初始位置 参数:座位和玩家人数
    getQiPaiStartPos:function(_num,_seq){
        var startPos = cc.p(0 , 0);
        if(_num==3){
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
        var pmType =null;
        if(phzVo.c <= 40){//小一到小十
            if(phzVo.c <= 20){
                pmType = "ht";//黑桃花色
            }else{
                pmType = "mh";//梅花花色
            }
        }else{//大一到大十
            if(phzVo.c <= 60){
                pmType = "hx";//红心花色
            }else{
                pmType = "fk";//方块花色
            }
        }
        var t = phzVo.t == 1 ? "s" : "b";
        var png = "big_cards_" + pmType + "_" + phzVo.n + t + ".png";
        return png
    },

    refreshCardByOpenTex:function() {
        var pmType = null;
        if(this.phzVo){
            if(this.phzVo.c <= 40){//小一到小十
                if(this.phzVo.c <= 20){
                    pmType = "ht";//黑桃花色
                }else{
                    pmType = "mh";//梅花花色
                }
            }else{//大一到大十
                if(this.phzVo.c <= 60){
                    pmType = "hx";//红心花色
                }else{
                    pmType = "fk";//方块花色
                }
            }
            var t = this.phzVo.t == 1 ? "s" : "b";
            var png = "big_cards_" + pmType + "_" + this.phzVo.n + t + ".png";

            if (this.bg){
                var frame = cc.spriteFrameCache.getSpriteFrame(png);
                this.bg.setSpriteFrame(frame);
            }

            if (this.bg1){
                var frame = cc.spriteFrameCache.getSpriteFrame(png);
                this.bg1.setSpriteFrame(frame);
            } 
        }
        

    },
    refreshCardBgByOpenTex:function(){
        // if(this.kuang){
        //     var pmType = PHZSetModel.pmxz;
        //     var kuangText = "cards_face_"+pmType+".png";
        //     var frame = cc.spriteFrameCache.getSpriteFrame(kuangText);
        //     this.kuang.setSpriteFrame(frame);
        // }
    },
    huPai:function(root,direct,renshu,isZimo){
        var path = "res/res_phz/hu_1.png";
        var armature = new cc.Sprite(path);
        armature.scale = 1.5;
        if(direct==1){
        	armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = 802;
        }else if(direct==3){
        	armature.x = 412;
            armature.y = 802;
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
        huang.runAction(cc.sequence(cc.scaleTo(1,1.5,1.5),cc.delayTime(1),cc.fadeTo(0.5,0),cc.callFunc(function(){
            huang.removeFromParent(true);
        })));
    },

    normalAction:function(prefix,root,direct,renshu){
    	var armature = new cc.Sprite("res/res_phz/"+prefix+"_1.png");
        armature.scale = 1.5;
        if(direct==1){
            armature.x = 960;
            armature.y = 540;
        }else if(direct==2){
            armature.x = 1507;
            armature.y = 802;
        }else if(direct==3){
        	armature.x = 412;
            armature.y = 802;
        }
        root.addChild(armature,999);

        armature.runAction(cc.sequence(cc.scaleTo(0.2,1.5,1.5),cc.delayTime(0.2),cc.fadeTo(0.5,0),cc.callFunc(function(){
        	armature.removeFromParent(true);
        })));
    },

    chiAnimate:function(ids,root,direct,callback,action,burCount){
        burCount = burCount || 0;
        var layout = PHZRoomModel.mineRoot.layouts[direct];
        var voArray = PHZAI.getVoArray(ids);
        var coords = null;

        var diffY = 71;
        var diffX = 56;

        var beginY1 = 700;//
        var beginY2 = 700;//
        var beginY3 = 700;//
        var beginY4 = 0;//


        if(PHZRoomModel.renshu==3){
            coords = {1:{x:1255,y:beginY1},2:{x:1470,y:beginY2},3:{x:450,y:beginY2}};
        }else{
            coords = {1:{x:1255,y:beginY1},2:{x:1470,y:beginY2}};
        }

        var initStarX = [537,SyConfig.DESIGN_WIDTH];
        if(PHZRoomModel.renshu==3){
            initStarX = [805,SyConfig.DESIGN_WIDTH,0];
        }

        var container = new cc.Sprite();
        container.setContentSize(voArray.length/3*40,534);
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
                var phz = new XPPHZCard(PHZAI.getDisplayVo(1,2),vo);
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
            // cc.log("my contain width ..." , container.width );
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1 + initStarX[0] + container.width/2;
        }else if(direct==2){
            x1 = x1 < 0 ? 0 : x1;
            x1 = initStarX[1]-x1-container.width/2;
        }else if(direct == 3){
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1+initStarX[2] +container.width/2;
        }else{
            x1 = x1 < 0 ? 0 : x1;
            x1 = x1 + 8 + container.width/2;
        }
        // cc.log("phz move to X...." , x1 + " " + layout.place2x + " Direct " + direct);
        if(PHZRoomModel.renshu==3){
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2},3:{x:x1,y:beginY2}};
        }else{
            coords1 = {1:{x:x1,y:beginY1},2:{x:x1,y:beginY2}};
        }

        var t1 = 0.35;//停顿速度
        var t2 = 0.08;//动作基础值
        var t3 = 0.01;//延时回调

        //动作时间
        if (PHZSetModel.cpsd){
            t2 = t2 + (PHZSetModel.cpsd-1)*0.10
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
                    innerVo.a = 0;
                    innerVo.as = 0;
                    if(j>0)
                        innerVo.a=1;
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
        kuang.runAction(cc.sequence(cc.scaleTo(0.5,1,1),cc.delayTime(0.8),cc.fadeTo(0.2,0),cc.callFunc(function(){
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
        var kuangImg = "res/res_phz/mopai_bj.png";
        var kuang = new cc.Sprite(kuangImg);
        kuang.x = 33;
        kuang.y = 121;
        kuang.scale=0.1;
        // root.addChild(kuang);
        var png = "phz_bg_cp.png";
        if(phzVo.c>0){
            if(phzVo.c <= 40){//小一到小十
                if(phzVo.c <= 20){
                    pmType = "ht";//黑桃花色
                }else{
                    pmType = "mh";//梅花花色
                }
            }else{//大一到大十
                if(phzVo.c <= 60){
                    pmType = "hx";//红心花色
                }else{
                    pmType = "fk";//方块花色
                }
            }
            var t = phzVo.t == 1 ? "s" : "b";
            var png = "big_cards_" + pmType + "_" + phzVo.n + t + ".png";
        }
        var bg = this.getSprite(png);
        bg.x = 33;
        bg.y = 121;
        bg.scale=0.1;
        root.addChild(bg);
        return kuang;
    },
}