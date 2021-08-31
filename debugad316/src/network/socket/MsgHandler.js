/**
 * Created by zhoufan on 2016/1/9.
 */
var MsgHandler = {
    reqMsgs:[],
    resMsgs:[],
    builders:{},
    resBuilders:{},
    responders:{},

    init:function(){
        this.reqMsgs = MsgConfig.reqMsgs;
        this.resMsgs = MsgConfig.resMsgs;
        this.builders = {};
        this.resBuilders = {};
        this.responders = {};
        //前台请求消息
        var length = this.reqMsgs.length;
        for(var i=0;i<length;i++){
            var msg = this.reqMsgs[i];
            var str_proto = null;
            if(msg.content){     // 加密文件
            	str_proto = Base64.decode(msg.content);
            }else{
            	str_proto = cc.loader.getRes(msg.file);
            }
            var builder = ProtoBuf.loadProto(str_proto);
            this.builders[msg.file] = {msgType:msg.type,builder:builder};
        }
        //前台响应消息
        length = this.resMsgs.length;
        for(i=0;i<length;i++){
            var msg = this.resMsgs[i];
            var str_proto = null;
            if(msg.content){     // 加密文件
            	str_proto = Base64.decode(msg.content);
            }else{
            	str_proto = cc.loader.getRes(msg.file);
            }
            var builder = ProtoBuf.loadProto(str_proto);
            this.resBuilders[msg.type] = {className:msg.className,builder:builder};
            this.responders[msg.type] = new msg.responder();
        }
    },

    /**
     * 获取请求消息的builder和msgType
     * @param path
     * @returns {msgType: number, builder: *}
     */
    getBuilder:function(path){
        var builder = this.builders[path];
        if(!builder){
            cc.log("builder not found::"+path);
            return null;
        }
        return builder;
    },

    /**
     * 获取响应消息的解码
     * @param msgType
     * @returns {className: string, builder: *}
     */
    getResBuilder:function(msgType){
        var builder = this.resBuilders[msgType];
        if(!builder){
            cc.log("resBuilder not found::"+msgType);
            return null;
        }
        return builder;
    },

    /**
     * 获取响应消息的处理类
     * @param msgType
     * @returns {*}
     */
    getResponder:function(msgType){
        var responder = this.responders[msgType];
        if(!responder){
            cc.log("resBuilder not found::"+msgType);
            return null;
        }
        return responder;
    },
}
