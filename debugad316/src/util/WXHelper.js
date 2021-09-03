/**
 * Created by zhoufan on 2018/5/25.
 */
/**
 * 微信登录处理类
 */
var WXHelper={
    appId:"wxdbcc74e79f1e991f",
    cheakAutoLoginBack:null,
    cleanCache:function(){
        var userInfo = cc.sys.localStorage;
        if (SdkUtil.hasXianLiao()) {
            userInfo.removeItem("weixin_auto_login_data");
        } else {
            userInfo.removeItem("access_token");
            userInfo.removeItem("fresh_token");
            userInfo.removeItem("openid");
        }
    },

    setCache: function(data) {
        var access_token=data.access_token;
        var fresh_token=data.refresh_token;
        var openid=data.openid;
        if (access_token) {
            cc.sys.localStorage.setItem("access_token",access_token+"");
        }
        if (fresh_token) {
            cc.sys.localStorage.setItem("fresh_token", fresh_token + "");
        }
        if (openid) {
            cc.sys.localStorage.setItem("openid", openid + "");
            cc.sys.localStorage.setItem("weixin_auto_login_data",openid+"");
        }
    },

    /**
     * 微信直接登录
     * @param params
     */
    first_login: function(json) {
        var params = JSON.parse(json);
        var userInfo = cc.sys.localStorage;
        //将本地的微信缓存数据穿给后台
        var xl_access_token = userInfo.getItem("xl_access_token");
        var xl_openid = userInfo.getItem("xl_openid");
        var xl_fresh_token= userInfo.getItem("xl_fresh_token");
        params.bind_access_token = xl_access_token;
        params.bind_openid = xl_openid;
        params.bind_fresh_token = xl_fresh_token;
        params.bind_pf = SyConfig.XLPF;
        sy.login.realLogin(params);
    },

    /**
     * 检测access_token是否有效
     * @param access_token
     * @param openid
     */
    check_access_token:function(){
        var userInfo = cc.sys.localStorage;
        var access_token = userInfo.getItem("access_token");
        var openid = userInfo.getItem("openid");
        var fresh_token= userInfo.getItem("fresh_token");
        if(access_token && openid && fresh_token){
            sy.scene.showLoading("正在登录");
            var	params={};
            params.access_token=access_token+"";
            params.openid=openid+"";
            params.refresh_token=fresh_token+"";
            //将本地的微信缓存数据穿给后台
            var xl_access_token = userInfo.getItem("xl_access_token");
            var xl_openid = userInfo.getItem("xl_openid");
            var xl_fresh_token= userInfo.getItem("xl_fresh_token");
            params.bind_access_token = xl_access_token;
            params.bind_openid = xl_openid;
            params.bind_fresh_token = xl_fresh_token;
            params.bind_pf = SyConfig.XLPF;
            sy.login.realLogin(params);
        }
    }
}