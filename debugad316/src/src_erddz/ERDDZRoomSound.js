/**
 * Created by cyp on 2019/11/13.
 */
var ERDDZRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========ERDDZRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

    },

    handleTableData:function(type,data){
        if(type == ERDDZTabelType.CreateTable){


        }else if(type == ERDDZTabelType.DealCard){


        }else if(type == ERDDZTabelType.PlayCard){

            if(data.cardType == 1){

                var name = "yaobuqi";
                var num = Math.random();
                if(num < 0.2)name = "guo";
                else if(num < 0.4)name = "pass";
                else if(num < 0.6)name = "buyao";

                this.playUserSound(name,data.seat);
            }else if(data.cardType == 0){

                var typeData = ERDDZRoomModel.getCardTypeData(data.cardIds);
                var soundName = "";
                if(typeData.type == ERDDZCardType.DanZhang){
                    soundName = "1_" + typeData.fv;
                }else if(typeData.type == ERDDZCardType.DuiZi){
                    soundName = "2_" + typeData.fv;
                }else if(typeData.type == ERDDZCardType.ShunZi){
                    soundName = "shunzi";
                }else if(typeData.type == ERDDZCardType.LianDui){
                    soundName = "liandui";
                }else if(typeData.type == ERDDZCardType.SanZhang){
                    soundName = "3_" + typeData.fv;
                }else if(typeData.type == ERDDZCardType.SanDaiYi){
                    soundName = "sandaiyi";
                }else if(typeData.type == ERDDZCardType.SanDaiDui){
                    soundName = "sandaidui";
                }else if(typeData.type == ERDDZCardType.FeiJi || typeData.type == ERDDZCardType.FeiJiDCB) {
                    soundName = "feiji";
                }else if(typeData.type == ERDDZCardType.ZhaDan){
                    soundName = "zhadan";
                }else if(typeData.type == ERDDZCardType.TianZha){
                    soundName = "wangzha";
                }else if(typeData.type == ERDDZCardType.SiDaiEr){
                    soundName = "sidaier";
                }

                if(soundName){
                    this.playUserSound(soundName,data.seat);
                }

            }

        }else if(type == ERDDZTabelType.JiaoDiZhu){
            var seat = data.params[0];
            var name = "bujiao";
            if(data.params[1] == 1)name = "jiaodizhu";
            this.playUserSound(name,seat);
        }else if(type == ERDDZTabelType.QiangDiZhu){
            var seat = data.params[0];
            var name = "buqiang";
            if(data.params[1] == 1)name = "qiangdizhu";
            this.playUserSound(name,seat);
        }else if(type == ERDDZTabelType.JiaBei){
            var seat = data.params[0];
            var name = "bujiabei";
            if(data.params[1] == 2)name = "jiabei";
            this.playUserSound(name,seat);
        }
    },

    playCommonSound:function(name){
        var file = "res/res_erddz/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_erddz/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = ERDDZRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

