/**
 * Created by cyp on 2019/10/21.
 */
var DTRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========DTRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

    },

    handleTableData:function(type,data){
        if(type == DTTabelType.CreateTable){


        }else if(type == DTTabelType.DealCard){


        }else if(type == DTTabelType.PlayCard){

            if(data.cardType == 1){
                this.playUserSound("pass",data.seat);
            }else if(data.cardType == 0){

                var typeData = DTRoomModel.getCardTypeData(data.cardIds);
                var soundName = "";
                if(typeData.type == DTCardType.DanZhang){
                    soundName = "1_" + typeData.fv;
                }else if(typeData.type == DTCardType.DuiZi){
                    soundName = "2_" + typeData.fv;
                }else if(typeData.type == DTCardType.LianDui){
                    soundName = "liandui";
                }else if(typeData.type == DTCardType.ShunZi){
                    soundName = "shunzi";
                }else if(typeData.type == DTCardType.SanZhang){
                    soundName = "sange";
                }else if(typeData.type == DTCardType.SanDaiYi){
                    soundName = "sandaiyi";
                }else if(typeData.type == DTCardType.SanDaiEr){
                    soundName = "sandaier";
                }else if(typeData.type == DTCardType.FeiJi) {
                    soundName = "feiji";
                }else if(typeData.type == DTCardType.WuShiK){
                    soundName = "510K";
                }else if(typeData.type == DTCardType.ZhaDan || typeData.type == DTCardType.TianZha){
                    soundName = "zhadan";
                }

                if(soundName){
                    this.playUserSound(soundName,data.seat);
                }

            }

        }
    },

    playCommonSound:function(name){
        var file = "res/res_diantuo/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_diantuo/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = DTRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

