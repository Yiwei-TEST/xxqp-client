/**
 * Created by zhoufan on 2018/5/22.
 */
var GameConfig = {

    servers: [],
    ports: [],
    nbservers: [],
    nbports: [],
    isnb: 0,
    isError: 0,
    isRegist:true,

    greenReq:function(url, onSuc, onErr){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET",url);
        xhr.timeout = 2100;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            onErr("");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var responseText = xhr.responseText;
                    if(responseText == ""){
                        onErr("");
                    }else{
                        var json = {};
                        try{
                            json = JSON.parse(responseText);
                        }catch(e){
                            onErr("");
                        }
                        onSuc(json);
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send("");
    },

    loadFromJson: function(target,onS) {
        var lurl = SyConfig.LOGIN_URL;
        //非现网，直接用本地的
        if(lurl.search(/phz.login.17bopi.com/) < 0){
            this.isError = 1;
            onS.call(target);
            return;
        }
        var remoteUrl = "http://res1.17bopi.com/config.json";
        this.isError = 0;
        this.isnb = 0;
        var now = new Date().getTime();
        var self = this;
        this.greenReq(remoteUrl+"?v="+now, function(data) {
            SdkUtil.sdkLog("load json successs......."+JSON.stringify(data));
            self.initData(data);
            onS.call(target);
        }, function() {
            SdkUtil.sdkLog("load json fail.......");
            self.isError = 1;
            onS.call(target);
        })
    },

    parseHost: function(host) {
        return host.split(",");
    },

    parsePort: function(port) {
        var result = [];
        var posts = port.split(";");
        for (var i=0;i<posts.length;i++) {
            var p = posts[i].split(",");
            result.push(p);
        }
        return result;
    },

    initData: function(json) {
        try {
            var servers = this.parseHost(json.servers);
            var ports = this.parsePort(json.ports);
            var nbservers = this.parseHost(json.nbservers);
            var nbports = this.parsePort(json.nbports);
        }catch(e) {
            this.isError = 1;
            return;
        }
        if (!TypeUtil.isArray(servers) || servers.length <= 0) {
            this.isError = 1;
            cc.log("GameConfig init fail.........."+servers.length);
            return;
        }
        this.servers = servers;
        this.ports = ports;
        this.nbservers = nbservers;
        this.nbports = nbports;
        this.isnb = json.isnb;

    },

    getWSUrl: function() {
        if (this.isError == 1) {
            return this.getDefaultWS();
        } else if (this.isnb == 1) {
            return this.getHighDefWS();
        } else {
            return this.getNormalWS();
        }
    },

    getDefaultWS: function() {
        var servers = this.parseHost(SyConfig.WS_HOST);
        var ports2 = this.parsePort(SyConfig.WS_PORT);
        var ws = "ws://";
        var rand = MathUtil.mt_rand(0, servers.length-1);
        ws += servers[MathUtil.mt_rand(0, servers.length-1)];
        var ports = ports2[rand];
        ws += ":" + ports[MathUtil.mt_rand(0, ports.length-1)];
        return ws;
    },

    getNormalWS: function() {
        var ws = "ws://";
        var rand = MathUtil.mt_rand(0, this.servers.length-1);
        ws += this.servers[rand];
        var ports = this.ports[rand];
        ws += ":" + ports[MathUtil.mt_rand(0,ports.length-1)];
        return ws;
    },

    getHighDefWS: function() {
        var ws = "ws://";
        var rand = MathUtil.mt_rand(0, this.nbservers.length-1);
        ws += this.nbservers[rand];
        var ports = this.nbports[rand];
        ws += ":" + ports[MathUtil.mt_rand(0,ports.length-1)];
        return ws;
    }
}
