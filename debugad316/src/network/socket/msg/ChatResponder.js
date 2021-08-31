var ChatResponder = BaseResponder.extend({

    respond:function(message){
    	message.f=true;
    	message.t=message.code;
    	ChatModel.receive(message);
    }
})