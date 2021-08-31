/**
 * Created by cyp on 2019/11/13.
 */
var TCGDRoomSound = cc.Class.extend({
    ctor:function(){
        cc.log("========TCGDRoomSound====ctor===");
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,2);

    },

    handleTableData:function(type,data){
        if(type == TCGDTabelType.CreateTable){


        }else if(type == TCGDTabelType.ShowHong3){

            this.playUserSound("first_out",TCGDRoomModel.nextSeat);

        }else if(type == TCGDTabelType.PlayCard){

            if(data.cardType == 1){
                this.playUserSound(Math.random() > 0.5?"yaobuqi":"pass",data.seat);

                if(data.isFirstOut){
                    var self = this;
                    setTimeout(function(){
                        self.playUserSound("dmjf",data.seat);
                    },1000);
                }

            }else if(data.cardType == 0){

                var typeData = TCGDRoomModel.getCardTypeData(data.cardIds);

                TCGDRoomModel.lianDuiOrFeiji(typeData,data.isLet);

                var soundName = "";
                if(typeData.type == TCGDCardType.DanZhang){
                    soundName = "1_" + typeData.fv;
                }else if(typeData.type == TCGDCardType.DuiZi){
                    soundName = "2_" + typeData.fv;
                }else if(typeData.type == TCGDCardType.ShunZi){
                    soundName = "shunzi";
                }else if(typeData.type == TCGDCardType.LianDui){
                    soundName = "liandui";
                }else if(typeData.type == TCGDCardType.SanZhang){
                    soundName = "3_" + typeData.fv;
                }else if(typeData.type == TCGDCardType.SanDaiDui){
                    soundName = "sandaier";
                }else if(typeData.type == TCGDCardType.FeiJi) {
                    soundName = "feiji";
                }else if(typeData.type == TCGDCardType.TongHuaShun){
                    soundName = "tonghuashun";
                }else if(typeData.type == TCGDCardType.ZhaDan){
                    soundName = "zhadan";
                }else if(typeData.type == TCGDCardType.TianZha){
                    soundName = "tianzha";
                }

                if(soundName){
                    this.playUserSound(soundName,data.seat);
                }

                var self = this;
                if(data.isBt > 0){
                    setTimeout(function(){
                        self.playUserSound("you_" + data.isBt,data.seat);
                    },1000);
                }else{
                    var warnNum = TCGDRoomModel.intParams[13];
                    var p = TCGDRoomModel.getPlayerDataByItem("seat",data.seat);
                    if((p.ext[8] <= warnNum) && (p.ext[8] + data.cardIds.length > warnNum)){
                        setTimeout(function(){
                            self.playUserSound("warning",data.seat);
                        },1000);
                    }
                }

            }

        }else if(type == TCGDTabelType.MingPai){
            var seat = data.params[0];
            this.playUserSound("mingpai",seat);
        }
    },

    playCommonSound:function(name){
        var file = "res/res_tcgd/sound/" + name + ".mp3";
        AudioManager.play(file);
    },

    playUserSound:function(name,seat){
        var sex = this.getSexWithSeat(seat);

        var file = "res/res_tcgd/sound/" + (sex == 1?"boy/":"girl/") + name + ".mp3";
        AudioManager.play(file);
    },

    getSexWithSeat:function(seat){
        var sex = 2;

        var p = TCGDRoomModel.getPlayerDataByItem("seat",seat);
        if(p)sex = p.sex;

        return sex;
    },


});

