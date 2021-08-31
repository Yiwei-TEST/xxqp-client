/**
 * Created by cyp on 2019/9/28.
 */
var YYBSRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========YYBSRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

        this.defenStep = 0;//用于控制垮庄，小倒，大倒音效只播放一次
    },

    handleTableData:function(type,data){
        if(type == YYBSTabelType.CreateTable){

            this.defenStep = YYBSRoomModel.getScoreType();

        } else if(type == YYBSTabelType.DealCard){
            this.playCommonSound("deal");
        }else if(type == YYBSTabelType.JiaoFen){

        }else if(type == YYBSTabelType.XuanZhu){
            var seat = YYBSRoomModel.nextSeat;
            var name = "";
            if(data.params[0] == 1)name = "fangkuai";
            if(data.params[0] == 2)name = "meihua";
            if(data.params[0] == 3)name = "hongtao";
            if(data.params[0] == 4)name = "heitao";

            this.playUserSound(name,seat);

            setTimeout(function(){
                this.playCommonSound("mai_pai");
            }.bind(this),1000);

        }else if(type == YYBSTabelType.DingZhuang){
            setTimeout(function(){
                this.playCommonSound("choose_color");
            }.bind(this),500);
        }else if(type == YYBSTabelType.PlayCard){
            if(data.cardType == 100){
                this.playCommonSound("out_card");
            }else{
                if(data.cardType == 0){
                    var isFirst  = false;
                    if(!data.isClearDesk && YYBSRoomModel.isFirstPlay(data.seat)){
                        isFirst = true;
                    }
                    var name = this.getCardTypeName(data.cardIds,isFirst);
                    if(name == "out_card" || name == "bile"){
                        this.playCommonSound(name);
                    }else if(name){
                        this.playUserSound(name,data.seat);
                    }
                }

                if(data.isClearDesk || data.cardType == 200){
                    var isOver = false;
                    var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
                    if(p && p.handCardIds.length == 0){
                        isOver = true;
                    }
                    if(data.cardType == 200)isOver = true;

                    var name = this.getDefenTypeName(isOver);
                    if(name){
                        setTimeout(function(){
                            this.playCommonSound(name);
                            this.playSoundAni(name);
                        }.bind(this),1000);
                    }

                }

            }
        }
    },

    //播放大倒，垮庄等对应音效的动画
    playSoundAni:function(name){
        var config = {"dadao":"大倒","xiaodao":"小倒","kuazhuang":"垮庄","baozhuang":"保庄","xiaoguang":"小光","daguang":"大光"};

        var label = new cc.LabelTTF(config[name],"res/font/bjdmj/fzcy.TTF",60);
        label.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 100);
        label.setScale(0);
        label.setColor(cc.color.YELLOW);
        cc.director.getRunningScene().addChild(label);

        var action = cc.sequence(cc.scaleTo(0.5,1).easing(cc.easeBackIn()),
            cc.delayTime(1),cc.fadeOut(0.5),cc.callFunc(function(node){
            node.removeFromParent(true);
        }));

        label.runAction(action);

    },

    getDefenTypeName:function(isOver){
        var name = "";

        var type = YYBSRoomModel.getScoreType();
        var config = {"-3":"dadao","-2":"xiaodao","-1":"kuazhuang","1":"baozhuang","2":"xiaoguang","3":"daguang"};

        if(isOver && type > 0){
            name = config[type];
        }

        if(this.defenStep > type && type < 0){
            name = config[type];
            this.defenStep = type;
        }
        return name;
    },

    getCardTypeName:function(ids,isFirst){
        var name = "";

        var isZhuPai = YYBSRoomModel.isZhuPai(ids[0]);
        if(ids.length == 1){
            if(isFirst)name = isZhuPai?"chu_1_zhu":"chu_1";
            else name = "out_card";
        }else if(YYBSRoomModel.isDuizi(ids)){
            if(isFirst)name = isZhuPai?"chu_2_zhu":"chu_2";
            else name = "chu_2";
        }else if(YYBSRoomModel.isTuolaji(ids)){
            if(isFirst)name = isZhuPai?"tuolaji_zhu":"tuolaji";
            else name = "tuolaji";
        }else{
            if(isFirst)name = "shuai_pai";
            else name = "out_card";
        }
        if(YYBSRoomModel.isBiPai){
            name = "bile";
        }

        return name;
    },

    playCommonSound:function(name){
        var file = "res/res_yybs/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_yybs/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = YYBSRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

