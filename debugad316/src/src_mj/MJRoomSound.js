/**
 * Created by zhoufan on 2016/7/28.1
 */
var MJRoomSound = {

    getPath:function(sex,audioName){
        cc.log("MJRoomModel.wanfa =",MJRoomModel.wanfa);
        var path = (sex==1) ? "man/" : "woman/";
        if (MJRoomModel.isYZWDMJ()){
            cc.log("res/res_mj/res_yzwdmj/yzwdmj/+path+audioName =","res/res_yzwdmj/yzwdmj/"+path+audioName);
            return "res/res_mj/res_yzwdmj/yzwdmj/"+path+audioName;
        }
        if (MJRoomModel.isAHMJ()){
            return "res/res_mj/res_ahmj/ahmj/"+path+audioName;
        }
        if (MJRoomModel.isTJMJ()){
            return "res/res_mj/res_csmj/tjmj/"+path+audioName;
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
            var type = cc.sys.localStorage.getItem("sy_mj_yuyan"+MJRoomModel.wanfa) || 2;
            if(type == 2){
                return "res/res_mj/res_dzmj/sound/" + path + audioName;
            }
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CSMJ || MJRoomModel.wanfa == GameTypeEunmMJ.TDH
            || MJRoomModel.wanfa == GameTypeEunmMJ.JZMJ){
           var type = parseInt(cc.sys.localStorage.getItem("sy_mj_yuyan"+MJRoomModel.wanfa))||cc.sys.localStorage.getItem("sy_mj_yuyan") || 1;
            if(type === 1){
                return "res/res_mj/res_csmj/csmj/pth/"+path+audioName;
            }else if(type === 3){
                return "res/res_mj/res_csmj/csmj/bdh2/"+path+audioName;
            }else{
                return "res/res_mj/res_csmj/csmj/bdh1/"+path+audioName;
            }
        }

        if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
            var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa))|| 2;
            var audioPath = "res/res_mj/audio/"+path+audioName;
            if(type === 2){
                audioPath = "res/res_mj/audio/tcmj/"+path+audioName;
            }
            // cc.log("audioPath =",JSON.stringify(audioPath));
            return audioPath;
        }

        if (MJRoomModel.wanfa == GameTypeEunmMJ.CQXZMJ){
            var audioPath = "res/res_mj/audio/cqxzmj/"+path+audioName;
            cc.log("audioPath =",JSON.stringify(audioPath));
            return audioPath
        }
        return "res/res_mj/audio/"+path+audioName;
    },

    pushOutSound:function(){
        AudioManager.play("res/res_mj/audio/out.mp3");
    },

    /**
     *
     * @param userId
     * @param mjVo {MJVo}
     */
    letOutSound:function(userId,mjVo){
        var vo = MJRoomModel.getPlayerVo(userId) || MJReplayModel.getPlayerVo(userId);
        var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa)) || 2;
        var format = ".wav";
        if(MJRoomModel.isZYMJ()|| MJRoomModel.isYZWDMJ() || MJRoomModel.isTJMJ() || MJRoomModel.wanfa == GameTypeEunmMJ.CQXZMJ || (MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ() && type == 2)){
            format = ".mp3";
        }
        var path = mjVo.t+""+mjVo.n;
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CSMJ || MJRoomModel.wanfa == GameTypeEunmMJ.TDH
            || MJRoomModel.wanfa == GameTypeEunmMJ.JZMJ){
            var localID = 1;//(Math.random() < 0.5 ? 1 : 2) + "";
            path = mjVo.t+""+mjVo.n+localID;
            format = ".mp3";
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
            var type = cc.sys.localStorage.getItem("sy_mj_yuyan"+MJRoomModel.wanfa) || 2;
            if(type == 2){
                format = ".mp3";
            }
            if(path == "410" && mjVo.isFirst){
                path = "first_facai";
            }
        }

        AudioManager.play(this.getPath(vo.sex,path+format));
    },

    actionSound:function(userId,prefix){
        var vo = MJRoomModel.getPlayerVo(userId) || MJReplayModel.getPlayerVo(userId);
        var type = parseInt(cc.sys.localStorage.getItem("tc_mj_yuyan"+MJRoomModel.wanfa)) || 2;
        var format = ".wav";
        if(prefix == "bai"){
            format = ".mp3";
            var randNum = cc.random0To1();
            prefix = randNum > 0.5 ? "bai":"wobaile";
        }
        if(MJRoomModel.isZYMJ() || prefix == "ting" || prefix == "buhua" || MJRoomModel.isYZWDMJ() || MJRoomModel.isTJMJ() || MJRoomModel.wanfa == GameTypeEunmMJ.CQXZMJ
            || ((MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()) && type==2)){
            format = ".mp3";
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.CSMJ || MJRoomModel.wanfa == GameTypeEunmMJ.TDH
            || MJRoomModel.wanfa == GameTypeEunmMJ.JZMJ){
            if(prefix == "peng" || prefix == "chi" || prefix == "bu" || prefix == "gang" || prefix == "hu" || prefix == "zimo"){
                var localID = 1;//Math.floor(Math.random() * 100)% 3 + 1;
                prefix += localID;
            }
            format = ".mp3";
        }
        if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
            var type = cc.sys.localStorage.getItem("sy_mj_yuyan"+MJRoomModel.wanfa) || 2;
            if(type == 2){
                format = ".mp3";
            }
        }

        AudioManager.play(this.getPath(vo.sex,prefix+format));
    },

    alertSound:function(){
        AudioManager.play("res/res_mj/audio/common/special_alert.mp3");
    },

    fixMsg:function(userId,id){
        var format = ".m4a";
        var sex = MJRoomModel.getPlayerVo(userId).sex;
        var path = (sex==1) ? "man/" : "woman/";
        var realPath = "res/res_mj/audio/fixMsg/"+path+ChatData.mj_fix_msg_name[id-1]+format;
        if(MJRoomModel.isTJMJ()){
            format = ".mp3";
            realPath = "res/res_mj/res_csmj/tjmj/"+path+ChatData.tjmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.YJMJ){
            format = ".mp3";
            realPath = "res/res_mj/res_yjmj/yjmj/"+path+ChatData.yjmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.isTCPFMJ() || MJRoomModel.isTCDPMJ()){
            format = ".mp3";
            realPath = "res/res_mj/audio/tcmj/"+path+"chat/"+ChatData.tcpfmj_fix_msg_name[id-1]+format;
        }else if(MJRoomModel.wanfa == GameTypeEunmMJ.DZMJ){
            realPath = "res/res_mj/res_dzmj/sound/" + path + "fixmsg/msg_" + id + ".mp3";
        }
        AudioManager.play(realPath);
    }

}
