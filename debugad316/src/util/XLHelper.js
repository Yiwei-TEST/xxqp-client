/**
 * Created by zhoufan on 2018/3/26.
 */
var XLHelper={
    appId:"SJ7otenYjvwB1iRb",
    cheakAutoLoginBack:null,

    xl_cleanCache:function(){
        var userInfo = cc.sys.localStorage;
        userInfo.removeItem("xianliao_auto_login_data");
    },

    xl_setCache: function(data) {
        if (!data.hasOwnProperty("access_token")) {
            return;
        }
        var access_token=data.access_token;
        var fresh_token=data.refresh_token;
        var openid=data.openid;
        cc.sys.localStorage.setItem("xl_access_token",access_token+"");
        cc.sys.localStorage.setItem("xl_fresh_token",fresh_token+"");
        cc.sys.localStorage.setItem("xl_openid",openid+"");
        cc.sys.localStorage.setItem("xianliao_auto_login_data",openid+"");
    },

    /**
     * 检测access_token是否有效
     * @param access_token
     * @param openid
     */
    xl_check_access_token:function(){
        var userInfo = cc.sys.localStorage;
        var access_token = userInfo.getItem("xl_access_token");
        var openid = userInfo.getItem("xl_openid");
        var fresh_token= userInfo.getItem("xl_fresh_token");
        var xianliao_auto_login_data = userInfo.getItem("xianliao_auto_login_data");
        SdkUtil.sdkLog("xian liao auto login........");
        if(access_token && openid && fresh_token && xianliao_auto_login_data){
            sy.scene.showLoading("正在登录");
            var param={};
            param.access_token=access_token;
            param.openid=openid;
            param.refresh_token = fresh_token;
            param.isXL = 1;
            //将本地的微信缓存数据穿给后台
            var wx_access_token = userInfo.getItem("access_token");
            var wx_openid = userInfo.getItem("openid");
            var wx_fresh_token= userInfo.getItem("fresh_token");
            param.bind_access_token = wx_access_token;
            param.bind_openid = wx_openid;
            param.bind_fresh_token = wx_fresh_token;
            param.bind_pf = SyConfig.WXPF;
            sy.login.realLogin(param);
        }
    },

    xl_first_login: function(params) {
        sy.scene.showLoading("正在登录");
        var userInfo = cc.sys.localStorage;
        var access_token = userInfo.getItem("access_token");
        var openid = userInfo.getItem("openid");
        var fresh_token= userInfo.getItem("fresh_token");
        params.bind_access_token = access_token;
        params.bind_openid = openid;
        params.bind_fresh_token = fresh_token;
        params.bind_pf = SyConfig.WXPF;
        sy.login.realLogin(params);
    },
}
