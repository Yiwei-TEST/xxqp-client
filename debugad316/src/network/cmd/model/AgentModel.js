var AgentModel = {
	InvitationCode:null,
	WeChat:null,
	QQ:null,
	MailBox:null,
	MobilePhone:null,
	
	init:function(user){
		if(user){
			this.InvitationCode = user.agencyId;
			this.WeChat = user.agencyWechat;
			this.MobilePhone = user.agencyPhone;
		}else{
			this.InvitationCode = null;
			this.WeChat = null;
			this.MobilePhone = null;
		}
		
	}
}