/**
 * Created by zhoufan on 2016/6/24.
 */
var LoginData = {
    versionCode:"",
    apkurl:null,
    apkvc:-1,
    blockIconTime:0,//临时屏蔽头像加载的字段，一般是个时间戳
    isAppleUser:false,

    onReview:function(obj){
        this.isAppleUser = (obj.isCN == 1) ? false : true;
        if (!this.isAppleUser) {
            cc.sys.localStorage.setItem("user_ap_cn_prefix",1);
        }
        cc.log("isaUser::"+this.isAppleUser+" "+JSON.stringify(obj));
    },

    isCnUser:function(){
        var lv = cc.sys.localStorage.getItem("user_ap_cn_prefix");
        if(!lv)
            lv = 0;
        return (lv == 1);
    },

    onLogin:function(obj){
        this.apkurl = obj.url || null;
        this.apkvc = obj.vc || -1;
        this.blockIconTime = 0;
        this.updateBlockIconTime(obj.blockIconTime);
        if(!this.isLoadIcon()){
            PlayerModel.headimgurl=PlayerModel.sex==1?"res/res_dtz/images/default_m_big.png":"res/res_dtz/images/default_w_big.png";
        }
        this.message = obj.message || "";
    },

    updateBlockIconTime:function(time){
        this.blockIconTime = time || 0;
        cc.log("updateBlockIconTime::"+this.blockIconTime);
    },

    /**
     * @return {boolean}
     */
    isLoadIcon:function(){
        var now = new Date().getTime();
        return (now>=this.blockIconTime);
    }
}

var GameData = {
    isHide:false,
    isShow:false,
    conflict:false,
    channelId:0
}