/**
 * Created by zhoufan on 2017/2/19.
 */

var ServerUtil = {

    NO_NEED_CHANGE_SOCKET:1,
    NEED_CHANGE_SOCKET:2,
    GET_SERVER_ERROR:3,
    GET_SERVER_SUCCESS:4,

    defaultLoginUrl:"",
    defaultReqUrl:"",
    backupSocketUrl:"",

    getServerFromTJD: function() {
        if (SyConfig.TJD) {
            var hosts = ["login1.abc.com","login2.abc.com"];
            var rand = MathUtil.mt_rand(0,hosts.length-1);
            var host = hosts[rand];
            var server = SdkUtil.sdkGetTJDServer(host, 80);
            SdkUtil.sdkLog("loginReq::" + server.ip);
            SdkUtil.sdkLog("loginReq::" + server.port);
            var tjdUrl = server.ip + ":" + server.port;
            SyConfig.LOGIN_URL = SyConfig.LOGIN_URL.replace("abc", tjdUrl);
            SyConfig.REQ_URL = SyConfig.REQ_URL.replace("abc", tjdUrl);
            SdkUtil.sdkLog("loginReq::"+SyConfig.LOGIN_URL);
        }
    },

    getWSFromTJD: function(wsurl) {
        if (SyConfig.TJD) {
            var urls = wsurl.split(":");
            SdkUtil.sdkLog("getWSFromTJD::"+urls);
            var port = parseInt(urls[2]);
            var hosts = ["app1.abc.com","app2.abc.com","app3.abc.com"];
            var rand = MathUtil.mt_rand(0,hosts.length-1);
            var host = hosts[rand];
            var server = SdkUtil.sdkGetTJDServer(host, port);
            SdkUtil.sdkLog("getWSFromTJD::" + server.ip);
            SdkUtil.sdkLog("getWSFromTJD::" + server.port);
            //ws://ws.baidu.com:7005
            wsurl = "ws://"+server.ip+":"+server.port;
            SdkUtil.sdkLog("getWSFromTJD::"+wsurl);
        }
        return wsurl;
    },


    /**
     * 切服
     * @param data
     */
    smartChooseSocketUrl:function(data){
        PlayerModel.clubTableId = data.tId;
        //cc.log("smartChooseSocketUrl"+JSON.stringify(data));
        this.backupSocketUrl = "";
    	if(data.code==0){
            //备用线路
            if (data.server.connectHost1) {
                this.backupSocketUrl = data.server.connectHost1;
            }
            GoldRoomConfigModel.goldRoomId = data.goldRoomId || 0;
    		if(data.hasOwnProperty("blockIconTime"))
    			LoginData.updateBlockIconTime(data.blockIconTime);
    		var url = data.server.connectHost;
            var isCrossServer = (sySocket.url != url);
    		PlayerModel.updateServerInfo(data.server);
    		if(isCrossServer){
    			sySocket.url = url;
    			sySocket.isCrossServer = true;
    			sySocket.disconnect(function(){
                    sySocket.connect(null,5);
                },5);
    		}else{
    			SyEventManager.dispatchEvent(SyEvent.GET_SERVER_SUC,ServerUtil.NO_NEED_CHANGE_SOCKET);
    		}
    	}else{
    		SyEventManager.dispatchEvent(SyEvent.NOGET_SERVER_ERR,ServerUtil.GET_SERVER_ERROR);
    	}
    },

    /**
     * 切换备用线路
     */
    connectBackupUrl: function() {
        this.setDefaultUrlConf();
        var url = this.backupSocketUrl;
        if(url != "" && sySocket.url != url){
            sySocket.url = url;
        }
        if(!sySocket.isOpen()){
            sySocket.connect(null,8);
        }
    },

    /**
     * 初始化备用（默认）的登录url
     */
    initDefaultUrlConf: function() {
        var url = SyConfig.LOGIN_URL;
        var reqUrl = SyConfig.REQ_URL;
        var loginValue = PlayerModel.getLocalLoginLevel();
        if(loginValue<=50){
            if(url.search(/dtz.login.52nmw.cn/) >= 0){
                var portRandom = MathUtil.mt_rand(10010,10022);
                url = url.replace(/dtz.login.52nmw.cn/, "dtz.login.52nmw.cn:"+portRandom);
                reqUrl = reqUrl.replace(/dtz.login.52nmw.cn/, "dtz.login.52nmw.cn:"+portRandom);
            }
        }else if(loginValue>50&&loginValue<=300){
            url = url.replace(/dtz.login.52nmw.cn/, "dtz.loginv2.sdwszz.com");
            reqUrl = reqUrl.replace(/dtz.login.52nmw.cn/, "dtz.loginv2.sdwszz.com");
        }else{
            url = url.replace(/dtz.login.52nmw.cn/, "dtz.loginv3.91dtz.cn");
            reqUrl = reqUrl.replace(/dtz.login.52nmw.cn/, "dtz.loginv3.91dtz.cn");
        }
        this.defaultLoginUrl = url;
        this.defaultReqUrl = reqUrl;
    },

    /**
     * 切换默认的登录地址
     * @returns {{url: string, reqUrl: string}}
     */
    setDefaultUrlConf: function() {
        SyConfig.LOGIN_URL = this.defaultLoginUrl;
        SyConfig.REQ_URL = this.defaultReqUrl;
    },

    /**
     * 获取新的可用地址
     * @param target
     * @param cb
     */
    getAvailableServer:function(target,cb){
        var params = {
            serverId:PlayerModel.serverId,
            connectHost:PlayerModel.connectHost
        };
        var self = this;
        Network.loginReq("qipai","checkIp",params,function(data){
            var url = data.connectHost;
            PlayerModel.connectHost = url;
            sySocket.url = url;
            cc.log("getAvailableServer::"+JSON.stringify(data));
            if(cb && target){
                cb.call(target,self.GET_SERVER_SUCCESS);
            }
        },function(){
            self.getAvailableServer(target,cb);
        });
    }
}