//
var HttpUrlRequest = cc.Class.extend({

    _xmlhttp:null,
    _url:"",
    _reqtype:"POST",
    _command:0,
    _body:"",
    _params:null,
    _onSuc:null,
    _onErr:null,
    _timeoutl:null,
    _timeoutt:null,

    ctor:function(url, command, param, onSuccess, onError){
        this._timeoutl = this._timeoutt = null;
        this._url = url;
        this._command = command;
        this._onSuc = onSuccess;
        this._onErr = onError;
        this._reqtype = param.type || "POST";
        this._params = param;
        var data = param || {};
        data.type = command;
        if(PlayerModel.userId > 0){
            data.userId = PlayerModel.userId;
            data.sessCode = PlayerModel.sessCode;
            data.sytime = new Date().getTime();
            var sign = data.sytime+"qZzWngop3t8OswG0";
            var md5str = md5(sign);
            data.sysign = md5str;
        }
        for(var key in data){
            var paramStr = key+"="+data[key];
            if(this._body == ""){
                this._body += paramStr;
            }else {
                this._body += "&"+paramStr;
            }
        }
    },

    response:function(responseText){
        if(responseText == ""){
            cc.log("NetWork response is null::"+this._command);
        }else{
            var json = {};
            try{
                json = JSON.parse(responseText);
            }catch(e){
                throw "network json parse exception::"+e;
            }
            var code = json.code;
            if(json.time){   // 校准时间
                ServerTimeManager.update(json.time);
            }
            if(!json.hasOwnProperty("code") || code == 0){
                if(this._onSuc)	this._onSuc(json);
            }else{
                ErrorUtil.handle(json);
                if(this._onErr)	this._onErr(json);
            }
        }
    },

    /**
     * 是否不转圈
     * @param command
     * @param param
     * @returns {Boolean}
     */
    isExclude:function(){
        var excludeFuncType = {
            "2":[],
            "3":[],
            "11":[1,8],
            "25":[7],
            "22":[]
        };
        var key = this._command+"";
        if(excludeFuncType.hasOwnProperty(key)){
            var array = excludeFuncType[key];
            if(array.length == 0){
                return true;
            }else{
                var funcType = this._params.funcType;
                if(funcType){
                    return (ArrayUtil.indexOf(array, funcType) >= 0);
                }
            }
        }
        return false;
    },

    request:function(){
        var xhr = this._xmlhttp = cc.loader.getXMLHttpRequest();
        //if(!cc.runtime){
        //    if(SyConfig.isNative() && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID)){
        //        xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        //    }
        //}
        xhr.open(this._reqtype, this._url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        //if(!this.isExclude()){
            //var loadingop = function(){
                //if(sy.scene)  sy.scene.showLoading("正在请求网络...");
            //}
            //this._timeoutl = setTimeout(loadingop,2000);
        //}
        var self = this;
        var onerror = function(){
            xhr.abort();
            //if(sy.scene)  sy.scene.hideLoading();
            //if(self._timeoutl!=null)
            //    clearTimeout(self._timeoutl);
            ServerUtil.getServerFromTJD();
            SocketErrorModel.updateLoginIndex();
            if(self._onErr)	self._onErr("");
            cc.log("NetWork error:status:"+xhr.status+" url:"+self._url+"?"+self._body);
        };
        xhr.onerror = onerror;
        xhr.ontimeout = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    //if(self._timeoutl!=null)
                    //    clearTimeout(self._timeoutl);
                    //if(sy.scene)
                    //    sy.scene.hideLoading();
                    //cc.log("NetWork error:status:"+xhr.status+" url:"+self._url+" body:"+self._body);
                    self.response(xhr.responseText);
                }else{
                    onerror.call(self);
                }
            }
        };
        xhr.send(this._body);
        return xhr;
    }
});

/**
 * http请求
 * @author zhoufan
 * @date 2014年10月20日
 * @version v1.0
 */
var Network = {
    gameUrl:"",
    reqtimes:null,
    excludeFuncType:{
        "1":[],
        "24":[],
        "25":[],
        "11":[1,8,14,15]
    },

    /**
     * 是否跳过过快点击
     * @param command
     * @param param
     * @returns {Boolean}
     */
    isExclude:function(command,param){
        var key = command+"";
        if(command=="")return true;
        if(this.excludeFuncType.hasOwnProperty(key)){
            var array = this.excludeFuncType[key];
            if(array.length == 0){
                return true;
            }else{
                var funcType = param.funcType;
                if(funcType){
                    return (ArrayUtil.indexOf(array, funcType) >= 0);
                }
            }
        }
        return false;
    },

    /**
     * HTTP请求
     * @param {Integer} command
     * @param {Object} param
     * @param {Function} onSuccess
     * @param {Function} onError
     */
    sypost : function(url,command,param,onSuccess,onError) {
        //if(!this.reqtimes)
        //    this.reqtimes = new SimpleHashMap();
        //if(!this.isExclude(command, param)){
        //    var now = new Date().getTime();
        //    var lasttime = this.reqtimes.get(command);
        //    lasttime = lasttime || 0;
        //    var diff = now - lasttime;
        //    if(diff < 500){
        //        var funcType = param.hasOwnProperty("funcType") ? param.funcType : 0;
        //        cc.log("requet is too fast! diff is "+diff+", command is "+command+" funcType is "+funcType);
        //        return null;
        //    }
        //    this.reqtimes.put(command, now);
        //}
        var req = new HttpUrlRequest(url,command,param,onSuccess,onError);
        var xhr = req.request();
        return xhr;
    },

    gameReq:function(command,param,onSuccess,onError){
    	var url = csvhelper.strFormat(SyConfig.LOGIN_URL,"support",command);
    	return this.sypost(url,command,param,onSuccess,onError);
    },
    payReq:function(command,param,onSuccess,onError){
    	var url = csvhelper.strFormat(SyConfig.LOGIN_URL,"pay",command);
    	return this.sypost(url,command,param,onSuccess,onError);
    },

    logReq:function(msg){
        var object = {};
        object.userId = PlayerModel.userId;
        object.msg = msg;
        return this.loginReq("log","clientLog",{log:JSON.stringify(object)});
    },

    loginReq:function(act,command,param,onSuccess,onError){
        var url = csvhelper.strFormat(SyConfig.LOGIN_URL,act,command);
        this.sypost(url,command,param,onSuccess,onError);
    },

    ipReq:function() {
        var url = csvhelper.strFormat(ServerUtil.defaultLoginUrl,"user","load");
        var userId = PlayerModel.userId;
        var now = new Date().getTime();
        var sign = userId+""+now+"qZzWngop3t8OswG0";
        var self = this;
        this.ipReqTimes += 1;
        Network.sypost(url,"load",{userId:userId, t:now, sign:sign},function(data){
            self.ipReqTimes = 0;
            cc.log("ipReq get ip success::"+data.message);
        },function(){
            if (self.ipReqTimes < 5) {
                self.ipReq();
            }
        });
    },

    startIpReq: function() {
        this.ipReqTimes = 0;
        this.ipReq();
    },

    //统一调用网站接口
    getWebUrl: function(url){
        var _nowTime = Math.round(new Date().getTime()/1000).toString();
        var _randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
        var _url = url;
        if (_url){
            var _obj = {
                "char_id":"" + PlayerModel.userId,
                "t":""+_nowTime,
                "rand":""+_randomNum
            };
            var _signKey = "dfc2c2d62dde2c104203cf71c6e15580";
            var _resultUrl = this.getSendUrl(_obj,_url,_signKey);
            return _resultUrl;
            //if (_resultUrl){
            //    SdkUtil.sdkOpenUrl(_resultUrl);
            //}
        }
        return false;
    },

    getSendUrl:function(obj,url,signKey){
        var resultUrl = null;
        if (obj){
            var _key = signKey;
            var _stringByDict = ObjectUtil.sortByDict(obj);
            var paramFinalStr = "";
            for(var key in _stringByDict){
                var paramStr = key+"="+_stringByDict[key];
                if (paramFinalStr == ""){
                    paramFinalStr = paramStr;
                }else{
                    paramFinalStr += "&" + paramStr;
                }
            }
            var _sign = md5(paramFinalStr + _key).toUpperCase();
            resultUrl = url + paramFinalStr + "&sign="+ _sign;
        }
        return resultUrl;

    },

    onSendShareSuccess:function(url){
        if (url){
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", url);
            xhr.timeout = 12000;
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

            var self = this;
            var onerror = function(){
                xhr.abort();
            }
            xhr.onerror = onerror;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(xhr.status == 200){

                    }else{
                        onerror.call(self);
                    }
                }
            }
            xhr.send();
        }
    },

    uploadUpdateErrorLog:function(_content) {
        return
        var errorLog = _content || "无内容";
        var time = new Date().getTime();
        var timeRound = UITools.getLocalItem("Socket_timeRound1");
        if (!timeRound || timeRound == ""){
            var Socket_timeRound1 = time + "" + Math.floor(Math.random()*1000)+1;
            UITools.setLocalItem("Socket_timeRound1",Socket_timeRound1);
        }
        errorLog = timeRound + "|" + errorLog + "|" + SyVersion.v + "|" + time + "|" + sySocket.url;
        cc.log("errorLog=====",JSON.stringify(errorLog))
        NetworkJT.loginReq("bjdAction", "clientLogMsg", {logMsg:errorLog}, function (data) {
        }, function (data) {
            if(data.message){
                // FloatLabelUtil.comText(data.message);
            }
        });
    },


    requestHttp:function(url,data,callBack) {
        var _url = url;
        var data = data;
        var _stringByDict = ObjectUtil.sortByDict(data);
        var paramFinalStr = "";
        for(var key in _stringByDict){
            var paramStr = key+"="+_stringByDict[key];
            if (paramFinalStr == ""){
                paramFinalStr = paramStr;
            }else{
                paramFinalStr += "&" + paramStr;
            }
        }

        var _sign = md5(paramFinalStr + "&key=dKPVJ60PJS8mlONb");

        cc.log("paramFinalStr==",paramFinalStr + "&key=dKPVJ60PJS8mlONb",_sign)

        data.sign = _sign;
        var _data = encodeURIComponent(AESUtil.encryptHttp(JSON.stringify(data)));
        cc.log("requestHttpData===",_data,AESUtil.encryptHttp(JSON.stringify(data)));
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", _url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            sy.scene.hideLoading();
            cc.log("==========requestHttp========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            sy.scene.hideLoading();
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var urlData = decodeURIComponent(xhr.responseText);
                    var _data = AESUtil.decryptHttp(JSON.parse(urlData));
                    data = JSON.parse(_data);
                    cc.log("requestHttp===",JSON.stringify(data));
                    if (data){
                        if (data.message){
                            var text = eval("'" + data.message + "'");
                            FloatLabelUtil.comText(text);
                        }
                        if (!data.code){
                            callBack();
                            callBack = null;
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send(_data);
    },

};
