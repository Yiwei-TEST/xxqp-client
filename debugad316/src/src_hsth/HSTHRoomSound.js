/**
 * Created by cyp on 2019/11/13.
 */
var HSTHRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========HSTHRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

    },

    handleTableData:function(type,data){
        if(type == HSTHTabelType.CreateTable){


        }else if(type == HSTHTabelType.DealCard){


        }else if(type == HSTHTabelType.PlayCard){

            if(data.cardType == 1){
                var num = Math.random();
                var name = "buyao0";
                if(num > 0.7)name = "buyao1";
                else if(num > 0.4)name = "buyao2";

                this.playCommonSound(name,data.seat);
            }else if(data.cardType == 0){

                var typeData = HSTHRoomModel.getCardTypeData(data.cardIds);
                var soundName = "";
                if(typeData.type == HSTHCardType.DanZhang){
                    soundName = "zhangshu_1";
                }else if(typeData.type == HSTHCardType.DuiZi){
                    soundName = "zhangshu_2";
                }else if(typeData.type == HSTHCardType.SanZhang){
                    soundName = "zhangshu_3";
                }else if(typeData.type == HSTHCardType.TongHua){
                    soundName = "tonghua_" + typeData.flag;
                }else if(typeData.type == HSTHCardType.ZhaDan){
                    soundName = "zhangshu_" + typeData.flag;
                }

                if(soundName){
                    this.playCommonSound(soundName,data.seat);
                }

            }

        }else if(type == HSTHTabelType.MingPai){
            var seat = data.params[0];
            this.playUserSound("mingpai",seat);
        }
    },

    playCommonSound:function(name){
        var file = "res/res_hsth/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_hsth/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = HSTHRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

