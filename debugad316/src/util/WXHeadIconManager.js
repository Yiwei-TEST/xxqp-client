/**
 * Created by Administrator on 2016/9/12.
 */
var WXHeadIconManager = {

    loadedList:[],
    loadedIconListInRoom:[],

    clean:function(){
        this.loadedList = [];
        this.loadedIconListInRoom = [];
    },

    hasLoaded:function(userId){
        return (ArrayUtil.indexOf(this.loadedList,userId)>=0);
    },

    isRemoteHeadImg:function(url){
        return (url.indexOf("http://")>=0 || url.indexOf("https://")>=0);
    },

    getPrefix:function(userId){
        return "user_head_icon_"+userId;
    },

    setLocalHeadImgUrl:function(userId,url){
        cc.sys.localStorage.setItem(this.getPrefix(userId),url);
    },

    isHeadImgRefresh:function(userId,url){
        var local = cc.sys.localStorage.getItem(this.getPrefix(userId));
        if(local && local!=url)
            return true;
        return false;
    },

    hasLocalHeadImg:function(userId){
        return jsb.fileUtils.isFileExist(this.getHeadImgPath(userId));
    },

    getHeadImgPath:function(userId){
        return jsb.fileUtils.getWritablePath()+this.getHeadImg(userId);
    },

    getHeadImg:function(userId){
        return this.getPrefix(userId)+".jpg";
    },

    SAVE_SUC:1,
    LOCAL_HAS:2,
    NOT_REMOTE:3,

    replaceUrl:function(url){
        var last = url.substring(url.length-1,url.length);
        if(last=="0"){
            url = url.substring(0,url.length-1);
            url += "132";
        }
        return url;
    },

    saveFile:function(userId,url,cb,target){
        var self=this;
        if(this.isRemoteHeadImg(url)){
            if(this.isHeadImgRefresh(userId,url) || !this.hasLocalHeadImg(userId)){
                cc.log("saveFile::"+url);
                cc.loader.loadImg(url,{width: 252, height:252},function(error, texture){
                    if (!error){
                        self.loadedList.push(userId);
                        self.setLocalHeadImgUrl(userId,url);
                        sy.scene.screenshotHeaderIcon(texture,userId,cb,target);
                        SdkUtil.sdkLog("local head img is not exist...save to file success..."+userId);
                    }
                });
            }else{
                SdkUtil.sdkLog("local head img has exist...direct to hall..."+userId);
                if(cb && target){
                    cb.call(target,self.LOCAL_HAS);
                }
            }
        }else{
            self.loadedList.push(userId);
            SdkUtil.sdkLog("the head img is not remote img..."+userId);
            if(cb && target){
                cb.call(target,self.NOT_REMOTE);
            }
        }
    }

}