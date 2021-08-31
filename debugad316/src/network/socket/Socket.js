/**
 * Created by zhoufan on 2016/1/9.
 */
var ProtoBuf = dcodeIO.ProtoBuf;
var ByteBuffer = dcodeIO.ByteBuffer;
var Long = dcodeIO.Long;
var SySocket = cc.Class.extend({
    url:null,
    socket:null,
    checkCode:0,
    clength:0,
    cmsgType:0,
    cbuffer:null,
    isConflict:false,
    reqtimes:null,
    isCrossServer:false,

    ctor:function(){
        this.socket = null;
        this.isConflict = false;
        this.checkCode = 0;
        this.reqtimes = {};
    },

    isOpen:function(){
        if(this.socket && this.socket.readyState == WebSocket.OPEN)
            return true;
        return false;
    },

    redisconnect:function(callback,tag){
        if(this.socket){
            this.socket.onerror = function(){
            }
            var wsid = this.socket.wsid;
            Network.uploadUpdateErrorLog("connect|19"  + "|" + wsid + "|" + tag + "|" + PlayerModel.userId);
            this.socket.onclose = function(e) {
                this.socket = null;
                PingClientModel.close();
                if(callback){
                    sy.socketQueue._dt = 10;
                    callback();
                }
            }.bind(this);
            this.socket.close();
        }else{
            this.socket = null;
            PingClientModel.close();
            if(callback){
                sy.socketQueue._dt = 10;
                callback();
            }
        }
    },

    disconnect:function(callback,tag){
        // var socketData = {};
        // socketData.code = 2;
        // socketData.tag = tag || null;
        // socketData.callback = callback || null;
        // sy.socketQueue.push(socketData);
        this.redisconnect(callback,tag);
    },

    sendOpenMsg:function(tag){
        if (!PlayerModel.userId || !PlayerModel.sessCode){
            // var str = "用户ID不存在！";
            // if (!PlayerModel.sessCode){
            //     str = "用户sessCode不存在！";
            // }
            // AlertPop.showOnlyOk("登陆失败，" + str);
            return
        }
        this.checkCode=0;
        var build = MsgHandler.getBuilder("proto/openMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var Open = builder.build("Open");
        var open = new Open();
        var userId = PlayerModel.userId+"";
        open.userId = userId;
        var time = md5(ServerTimeManager.getServerTime());
        var sign = userId+time+"Zehy6f3TDoZhtyWlHiyJmoFGrQWjxiT9";
        open.t = time;
        open.s = md5(sign);
        open.c = PlayerModel.sessCode;
        open.v = SyVersion.getVersion();
        if(PlayerModel.isDirect2Room())
            open.fromUrl = "fromUrlScheme";
        if(this.isCrossServer)
            open.isCrossServer = 1;
        open.msg = [];
        open.msg[0] = tag || 0;

        this.send(open,msgType);
    },

    sendComReqMsg:function(code,params,strParams,opType){
        //cc.log("sendComReqMsg ... code : " + code + " params " +  JSON.stringify(params) +" strParams " + JSON.stringify(strParams) );
        var build = MsgHandler.getBuilder("proto/ComReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var ComReq = builder.build("ComReq");
        var msg = new ComReq();
        msg.code  = code;
        msg.optType  = opType || 0;
        if(params)
            msg.params = params;
        if(strParams)
            msg.strParams = strParams;
        this.send(msg,msgType);
    },

    sendLoginReqMsg:function(code,params,strParams){
        //cc.log("sendComReqMsg ... code : " + code + " params " +  JSON.stringify(params) +" strParams " + JSON.stringify(strParams) );
        var build = MsgHandler.getBuilder("proto/LoginReqMsg.txt");
        var msgType = build.msgType;
        var builder = build.builder;
        var ComReq = builder.build("ComReq");
        var msg = new ComReq();
        msg.code  = code;
        if(params)
            msg.params = params;
        if(strParams)
            msg.strParams = strParams;
        this.send(msg,msgType);
    },

    reconnect:function(jsonParams,tag){
        GameData.channelId = 0;
        if(this.isConflict || !this.isNeedConnet()){
            return;
        }
        var time = new Date().getTime();
        var wsid =   time + "" + Math.floor(Math.random()*10000)+1;
        this.clength = 0;
        var _this = this;
        var connectStr = "connect|1";
        if(this.socket){
            this.socket.onclose = function(e) {
                SdkUtil.sdkLog("websocket is close.....................................22");
            }
            this.socket.close();
        }
        // Network.uploadUpdateErrorLog(connectStr  + "|" + wsid + "|" + tag + "|" + PlayerModel.userId);
        var url = ServerUtil.getWSFromTJD(this.url);
        this.socket = new WebSocket(url);
        this.socket.wsid = wsid;
        var timeStart = new Date(); //开始时间
        //连接成功
        this.socket.onopen = function(e) {
            _this.reqtimes = {};
            var timeEnd = new Date(); //结束时间
            //发送连接成功的消息
            var that = this;
            connectStr = "connect|4";
            if (jsonParams) {
                connectStr = "connect|5";
                _this.sendLoginReqMsg(1, [], [jsonParams]);
            } else {
                connectStr = "connect|6";
                _this.sendOpenMsg(tag);
            }
            sy.socketQueue._url = _this.socket._url;
            sy.socketQueue._isLoading = false;
            var timeDis = timeEnd.getTime()-timeStart.getTime() ;//时间差的毫秒
            // Network.uploadUpdateErrorLog(connectStr  + "|" + that.wsid + "|" + tag + "|" + PlayerModel.userId + "|" + timeDis);
            SdkUtil.sdkLog("websocket is connect success.....................................");
        }
        //收到消息
        this.socket.onmessage = function(e) {
            _this.receive(e.data);
        }
        //关闭连接
        this.socket.onclose = function(e) {
            var that = this;
            SdkUtil.sdkLog("websocket is close.....................................1");
            connectStr = "connect|7";
            if ( _this.socket && _this.socket.wsid == that.wsid){
                PingClientModel.close();
                _this.socket = null;
                if (PlayerModel.userId > 0) {
                    NetErrorPop.show(true);
                } else {
                    sy.scene.hideLoading();
                }
            }
            Network.uploadUpdateErrorLog(connectStr + "|" + that.wsid + "|" + tag + "|" + PlayerModel.userId);
        }
        //连接异常
        this.socket.onerror = function(e) {
            var that = this;
            connectStr = "connect|11";
            SdkUtil.sdkLog("websocket is error.....................................3");
            if (_this.socket && _this.socket.wsid == that.wsid) {
                PingClientModel.close();
                _this.socket = null;
                if (PlayerModel.userId > 0) {
                    connectStr = "connect|12";
                    NetErrorPop.show(true);
                } else {
                    SocketErrorModel.updateGameIndex();
                    FloatLabelUtil.comText("登录失败" + SocketErrorModel._gameIndex);
                    connectStr = "connect|13";
                    sy.scene.hideLoading();
                }
            }
            // Network.uploadUpdateErrorLog(connectStr + "|" + that.wsid + "|" + tag + "|"+ PlayerModel.userId);
        }
    },

    connect:function(jsonParams,tag){
        // var socketData = {};
        // socketData.code = 1;
        // socketData.tag = tag || null;
        // socketData.jsonParams = jsonParams || null;
        // sy.socketQueue.push(socketData);

        this.reconnect(jsonParams,tag);
    },

    /**
     * 是否需要建立新的连接
     */
    isNeedConnet: function() {
        var isNeed = true;
        // if (this.socket && this.socket._url && this.socket._url == sy.socketQueue._url){
        //     isNeed = false;
        // }
        return isNeed;
    },

    send:function(message,msgType){
        if(this.socket){
            if(this.socket.readyState == WebSocket.OPEN){
                var prefix = (msgType==1002) ? msgType+"_"+message.code : msgType;
                 if(prefix!="1002_13" && prefix!="1002_5" && prefix!="1002_14" && prefix!="1002_11" &&
                    prefix!="1002_10"&& prefix!="1002_30" && prefix!="1002_100" && prefix!="1002_95" && prefix!="1002_135"
                    && prefix!="1002_136" && prefix!="1002_137" && prefix!="1002_1111" && prefix != "1002_139" &&
                    prefix != "1002_1131" && prefix != "1002_4520"){
                     if (prefix == 1003 && (message.code == 1 || message.code == 2 ||  message.code == 5 || message.code == 6)){
                         var lasttime = this.reqtimes[prefix];
                         lasttime = lasttime || 0;
                         var now = new Date().getTime();
                         var diff = now - lasttime;
                         if (diff < 750) {
                             cc.log("requet is too fast! diff is " + diff + ", msgType is " + prefix);
                             return;
                         }
                     }
                    
                }
                this.reqtimes[prefix] = now;
                var checkCode = this.checkCode;
                var arrayBuffer = message.encode().toBuffer();
                var msgLength = arrayBuffer.byteLength;
                var byteBuffer = new ByteBuffer();
                byteBuffer.writeUint16(msgLength);
                if(msgType == 1001){
                    checkCode = 0;
                }else{
                    var bytes = new Int8Array(arrayBuffer);
                    for(var i=0;i<msgLength;i+=2){
                        checkCode += bytes[i];
                    }
                }
                byteBuffer.writeUint32(checkCode);
                byteBuffer.writeUint16(msgType);
                byteBuffer.append(arrayBuffer);
                byteBuffer.flip();
                this.socket.send(byteBuffer.toArrayBuffer());
            }else{
                SdkUtil.sdkLog("websocket is error.....................................1");
                NetErrorPop.show(true);
            }
        }else{
            SdkUtil.sdkLog("websocket is error.....................................2");
            NetErrorPop.show(true);
        }
    },

    receive:function(data) {
        if (!TypeUtil.isString(data)) {
            var byteBuffer = ByteBuffer.wrap(data);
            if(this.clength == 0){
                var length = this.clength = byteBuffer.readUint16();
                var checkcode = byteBuffer.readUint32();
                if(this.checkCode!=0 && (checkcode-this.checkCode)>1){//checkcode对不上了
                    NetErrorPop.show(true);
                    return;
                }
                this.checkCode = checkcode;
                var msgType = this.cmsgType = byteBuffer.readUint16();
                cc.log("l::" + length + " c::" + checkcode + " m::" + msgType);
                this.cbuffer = byteBuffer;
            }else{
                var finalbuffer = ByteBuffer.concat([this.cbuffer,byteBuffer]);
                this.cbuffer = finalbuffer;
            }
            var arrayBuffer = this.cbuffer.toBuffer();
            var nowLength = arrayBuffer.byteLength;
            if(this.clength==nowLength){
                this.clength = 0;
                var resBuilder = MsgHandler.getResBuilder(this.cmsgType);
                if(resBuilder){
                    var className = resBuilder.className;
                    var builder = resBuilder.builder;
                    var MsgClass = builder.build(className);
                    var message = MsgClass.decode(arrayBuffer);
                    MsgHandler.getResponder(this.cmsgType).respond(message);
                    if (this.cmsgType != 5021){
                        PingClientModel.respond();
                    }
                }else{
                    cc.log("message can not decode::"+this.cmsgType);
                }
            }
        }
    }
});
var _sySocket = null;
var sySocket = function () {
    if (_sySocket == null) {
        _sySocket = new SySocket();
    }
    return _sySocket;
}();