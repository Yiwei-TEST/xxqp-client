/**
 * Created by zhoufan on 2016/6/30.
 */
var DTZRoomSound = {

    getPath:function(sex,audioName){
        var path = (sex == 1) ? "man/" : "woman/";
        var fileNameTag = (sex == 1) ? "n" : "v";
        return "res/res_dtz/dtzSound/" + path + fileNameTag + audioName;
    },

    //倒计时音效
    timeSound:function(){
        AudioManager.play("res/res_dtz/dtzSound/timed.mp3");
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
            sex = DTZRoomModel.getPlayerVo(userId).sex;
        }

        if(!lastCardPattern)
            return;

        var cardN = lastCardPattern.value;
        //if(lastCardPattern.value == 14){
        //    cardN = 1;
        //}else if(lastCardPattern.value == 15){
        //    cardN = 2;
        //}


        var fileNameTag = (sex==1) ? "n" : "v";
        var boomLenth = lastCardPattern.length;

        switch (lastCardPattern.type){
            case DTZAI.SINGLE:
                if(cardN >= 5){
                    AudioManager.play(this.getPath(sex, cardN +".mp3"));
                }
                break;
            case DTZAI.PAIR:
                if(lastCardPattern.length == 2){
                    AudioManager.play(this.getPath(sex, cardN + "d.mp3"));//lastCardPattern.sortedCards[0].n
                }
                break;
            case DTZAI.LIANDUI:
                AudioManager.play(this.getPath(sex,  "double_line.mp3"));
                break;
            case DTZAI.SHUNZI:
                //AudioManager.play(this.getPath(sex,"shunzi.wav"));
                break;
            case DTZAI.THREE:
            case DTZAI.THREEWithCard:
                AudioManager.play(this.getPath(sex , cardN + "t.mp3"));
                break;
            case DTZAI.PLANE:
            case DTZAI.PLANEWithCard:
                AudioManager.play(this.getPath(sex , "wing.mp3"));
                break;
            case DTZAI.BOMB:
                if(boomLenth >= 4 && boomLenth <= 10){
                    AudioManager.play(this.getPath(sex,  boomLenth +"bomb.mp3"));
                }else{
                    AudioManager.play("res/res_dtz/dtzSound/Snd_bombsmall.mp3");
                }
                break;
            case DTZAI.TONGZI:
                AudioManager.play(this.getPath(sex, cardN +"tongzi.mp3"));
                break;
            case DTZAI.SUPERBOOM:
                AudioManager.play("res/res_dtz/dtzSound/Snd_bombbig.mp3");
                break;
            case DTZAI.XI:
                AudioManager.play(this.getPath(sex, cardN +"Xi.mp3"));
                break;
        }
    },

    yaobuqi:function(userId){
        //cc.log("播放要不起音效");
        AudioManager.play(this.getPath(DTZRoomModel.getPlayerVo(userId).sex,"pass.mp3"));
    },

    baoting:function(userId , oneOrTwe){
        if(oneOrTwe){
            AudioManager.play(this.getPath(DTZRoomModel.getPlayerVo(userId).sex,"baodan.wav"));
        }else{
            AudioManager.play(this.getPath(DTZRoomModel.getPlayerVo(userId).sex,"baoshuang.wav"));
        }
        //AudioManager.play(this.getPath(DTZRoomModel.getPlayerVo(userId).sex,"baojing.wav"));
    },

    fixMsg:function(userId,id){
        cc.log("id..." , id);
        var format = ".mp3";
        var sex = DTZRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var filenameTag = (sex == 1)? "n" : "v";
        var realPath = "res/audio/fixMsg/" + path + filenameTag + ChatData.dtz_fix_msg_name[id-1]+format;
        AudioManager.play(realPath);
    }

}
