/**
 * Created by cyp on 2019/11/13.
 */
var NSBRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========NSBRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

    },

    handleTableData:function(type,data){
        if(type == NSBTabelType.CreateTable){


        }else if(type == NSBTabelType.DealCard){


        }else if(type == NSBTabelType.PlayCard){

            if(data.cardType == 1){
                this.playUserSound("pass",data.seat);
            }else if(data.cardType == 0){

                var typeData = NSBRoomModel.getCardTypeData(data.cardIds);
                var soundName = "";
                if(typeData.type == NSBCardType.DanZhang){
                    soundName = "1_" + typeData.fv;
                }else if(typeData.type == NSBCardType.DuiZi){
                    soundName = "2_" + typeData.fv;
                }else if(typeData.type == NSBCardType.ShunZi){
                    soundName = "shunzi";
                }else if(typeData.type == NSBCardType.LianDui){
                    soundName = "liandui";
                }else if(typeData.type == NSBCardType.SanZhang){
                    soundName = "3_" + typeData.fv;
                }else if(typeData.type == NSBCardType.SanDaiDui){
                    soundName = "sandaier";
                }else if(typeData.type == NSBCardType.FeiJi || typeData.type == NSBCardType.FeiJiDaiLD) {
                    soundName = "feiji";
                }else if(typeData.type == NSBCardType.WuShiK) {
                    soundName = "510K";
                }else if(typeData.type == NSBCardType.TongHuaShun){
                    soundName = "tonghuashun";
                }else if(typeData.type == NSBCardType.ZhaDan){
                    soundName = "zhadan";
                }else if(typeData.type == NSBCardType.TianZha){
                    soundName = "tianzha";
                }

                if(soundName){
                    this.playUserSound(soundName,data.seat);
                }

            }

        }else if(type == NSBTabelType.MingPai){
            var seat = data.params[0];
            this.playUserSound("mingpai",seat);
        }
    },

    playCommonSound:function(name){
        var file = "res/res_nsb/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_nsb/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = NSBRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

