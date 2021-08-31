/**
 * Created by zhoufan on 2016/6/30.//
 */
var PDKRoomSound = {

    getPath:function(sex,audioName){
        var path = (sex==1) ? "man/" : "woman/";
        return "res/res_pdk/pdkSound/"+path+audioName;
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
            sex = PDKRoomModel.getPlayerVo(userId).sex;
        }
        if(!lastCardPattern || !lastCardPattern.sortedCards || !lastCardPattern.sortedCards[0])
            return;
        switch (lastCardPattern.type){
            case PDKAI.SINGLE:
                AudioManager.play(this.getPath(sex,"pk_"+lastCardPattern.sortedCards[0].n+".wav"));
                break;
            case PDKAI.PAIR:
                if(lastCardPattern.sortedCards.length == 2){
                    AudioManager.play(this.getPath(sex,"dui"+lastCardPattern.sortedCards[0].n+".wav"));
                }else{
                    AudioManager.play(this.getPath(sex,"liandui.wav"));
                }
                break;
            case PDKAI.SHUNZI:
                AudioManager.play(this.getPath(sex,"shunzi.wav"));
                break;
            case PDKAI.THREE:
                if(lastCardPattern.sortedCards.length == 3){
                    AudioManager.play(this.getPath(sex,"sange.wav"));
                }else if(lastCardPattern.sortedCards.length == 4){
                    AudioManager.play(this.getPath(sex,"sandaiyi.wav"));
                }else{
                    AudioManager.play(this.getPath(sex,"sandaiyidui.wav"));
                }
                break;
            case PDKAI.PLANE:
                AudioManager.play(this.getPath(sex,"feiji.wav"));
                break;
            case PDKAI.BOMB:
                AudioManager.play(this.getPath(sex,"zhadan.wav"));
                break;
        }
    },

    yaobuqi:function(userId){
        AudioManager.play(this.getPath(PDKRoomModel.getPlayerVo(userId).sex,"buyao.wav"));
    },

    baoting:function(userId){
        AudioManager.play(this.getPath(PDKRoomModel.getPlayerVo(userId).sex,"baojing.wav"));
    },

    fixMsg:function(userId,id){
        var format = ".m4a";
        var sex = PDKRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var realPath = "res/audio/fixMsg/"+path+ChatData.pdk_fix_msg_name[id-1]+format;
        AudioManager.play(realPath);

    }

}
