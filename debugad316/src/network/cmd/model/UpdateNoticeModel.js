/**
 * Created by Administrator on 2016/6/24.
 */
var UpdateNoticeModel = {
    v:0,
    content:"",
    init:function(data){
        this.v = data.version || 0;
        this.content = data.content || "";
        this.setNoticeVersion();
    },

    isPopOut:function(version){
        var isPop = false;
        var oldV = cc.sys.localStorage.getItem(this.getNoticeVersionPrefix());
        if(oldV != version ){
            this.v = version;
            isPop = true;
        }
        return isPop;
    },

    getNoticeVersion:function(){
        return this.v;
    },

    setNoticeVersion:function(){
        cc.sys.localStorage.setItem(this.getNoticeVersionPrefix(),this.v);
    },

    getNoticeVersionPrefix:function(){
        return "update_notice_version";
    },

    //获取更新公告内容
    getNoticeContent:function(){
        return this.content || "";
    }
}