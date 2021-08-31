/**
 * Created by Administrator on 2020/6/3.
 */
var XPLPRoomSound = {

    getPath:function(sex,audioName){
        //cc.log("XPLPRoomModel.wanfa =",XPLPRoomModel.wanfa);
        var path = (sex==1) ? "man/" : "woman/";
        var tempPath = PHZSetModel.yyxz == 2 ? "pth/" : "bdh/";
        var resultPath = "res/res_phz/phzSound/xplp/"+tempPath+path+audioName;
        return resultPath;
    },

    pushOutSound:function(){
        AudioManager.play("res/res_phz/phzSound/out.mp3");
    },

    /**
     *
     * @param userId
     * @param mjVo {MJVo}
     */
    letOutSound:function(userId,mjVo){
        var vo = XPLPRoomModel.getPlayerVo(userId) || XPLPReplayModel.getPlayerVo(userId);
        var format = ".mp3";
        var path = mjVo.t+""+mjVo.n;
        AudioManager.play(this.getPath(vo.sex,path+format));
    },

    actionSound:function(userId,prefix){
        var vo = XPLPRoomModel.getPlayerVo(userId) || XPLPReplayModel.getPlayerVo(userId);
        var format = ".mp3";
        AudioManager.play(this.getPath(vo.sex,prefix+format));
    },

    alertSound:function(){
        AudioManager.play("res/res_phz/phzSound/common/special_alert.mp3");
    },

    fixMsg:function(userId,id){
        var format = ".m4a";
        var sex = XPLPRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var realPath = "res/res_mj/audio/fixMsg/"+path+ChatData.mj_fix_msg_name[id-1]+format;
        AudioManager.play(realPath);
    }

}
