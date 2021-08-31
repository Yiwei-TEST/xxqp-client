/**
 * Created by zhoufan on 2016/6/30.
 */
var QFRoomSound = {
    bombNumber:0,
    getPath:function(sex,audioName){
        var path = (sex == 1) ? "man/" : "woman/";
        var fileNameTag = (sex == 1) ? "n" : "v";
        return "res/res_yjqf/audio/qfSound/" + path + fileNameTag + audioName;
    },

    /**
     * @param cardIds {CardPattern}
     * @param cardIds {Array.<number>}
     */
    letOutSound:function(userId,lastCardPattern,state){
        var sex = null;
        if(state == -1){
            sex = PlayBackModel.getPlayerVo(userId).sex;
        }else{
            sex = QFRoomModel.getPlayerVo(userId).sex;
        }

        if(!lastCardPattern)
            return;

        var cardN = lastCardPattern.value;
        if(QFRoomModel.isSave67 != 1 && lastCardPattern.value == 7){
            cardN = 5;
        }

        //var fileNameTag = (sex==1) ? "n" : "v";
        var boomLenth = lastCardPattern.length;

        switch (lastCardPattern.type){
            case QFAI.SINGLE:
                if(cardN >= 5){
                    AudioManager.play(this.getPath(sex, cardN +".mp3"));
                }
                break;
            case QFAI.PAIR:
                if(lastCardPattern.length == 2){
                    AudioManager.play(this.getPath(sex, cardN + "d.mp3"));//lastCardPattern.sortedCards[0].n
                }
                break;
            case QFAI.LIANDUI:
                AudioManager.play(this.getPath(sex,  "double_line.mp3"));
                break;
            case QFAI.SHUNZI:
                AudioManager.play(this.getPath(sex,"shunzi.mp3"));
                break;
            case QFAI.THREE:
                AudioManager.play(this.getPath(sex , cardN + "three.mp3"));
                break;
            case QFAI.PLANE:
                AudioManager.play(this.getPath(sex , "wing.mp3"));
                break;
            case QFAI.BOMB:
                if(this.bombNumber == 0){
                    AudioManager.play(this.getPath(sex,  "zhadan.mp3"));
                }else if(this.bombNumber == 1){
                    AudioManager.play(this.getPath(sex,  "huanshang.mp3"));
                }else if(this.bombNumber == 2){
                    AudioManager.play(this.getPath(sex,  "dani1.mp3"));
                }else if(this.bombNumber == 3){
                    AudioManager.play(this.getPath(sex,  "yasi.mp3"));
                }

                // AudioManager.play("res/audio/qfSound/Special_Bomb.mp3");
                break;
        }
        if(lastCardPattern.type == QFAI.BOMB){
            this.bombNumber++;
            if(this.bombNumber>3){
                this.bombNumber = 1;
            }
        }else{
            this.bombNumber = 0;
        }
    },

    yaobuqi:function(userId){
        //cc.log("播放要不起音效");
        AudioManager.play(this.getPath(QFRoomModel.getPlayerVo(userId).sex,"pass.mp3"));
    },

    //fixMsg:function(userId,id){
    //    var format = ".m4a";
    //    var sex = QFRoomModel.getPlayerVo(userId).sex;
    //    var path = (sex==1) ? "man/" : "woman/";
    //    var realPath = "res/audio/fixMsg/"+path+ChatData.pdk_fix_msg_name[id-1]+format;
    //    AudioManager.play(realPath);
    //},


    fixMsg:function(userId,id,voiceSelect){
        var sex = QFRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "male_chat_0" : "famale_chat_0";
        var realPath = "res/res_yjqf/audio/fixMsg/qianfen/"+path+(id-1)+".mp3";
        AudioManager.play(realPath);
    }

    //fixMsg:function(userId,id){
    //    cc.log("id..." , id);
    //    var format = ".mp3";
    //    var sex = QFRoomModel.getPlayerVo(userId).sex;
    //    var path = (sex==1) ? "man/" : "woman/";
    //    var realPath = "res/audio/fixMsg/" + path + ChatData.qf_fix_msg_name[id-1]+format;
    //
    //    cc.log("realPath==="+realPath)
    //    AudioManager.play(realPath);
    //}
    //

}
