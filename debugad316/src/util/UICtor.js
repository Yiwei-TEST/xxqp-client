var UICtor = {
		
	cPanel:function(size,color,opacity){
		var widget = new ccui.Layout();
		widget.setBackGroundColorType(1);
		widget.setBackGroundColor(color);
		widget.setBackGroundColorOpacity(opacity);
		widget.setContentSize(size);
		return widget;
	},
		
	cLabel:function(label, fontSize, dimensions, color, hAlignment, vAlignment){
		var text = new ccui.Text(label,"res/font/bjdmj/fznt.ttf",fontSize);
		if(dimensions)	text.setTextAreaSize(dimensions);
		if(color)text.setColor(color);

		if(hAlignment!=null)
			text.setTextHorizontalAlignment(hAlignment);
		if(vAlignment!=null)
			text.setTextVerticalAlignment(vAlignment);
		return text;
	},
	
	cText:function(fontSize,size,maxLengthEnable,maxLength){
		var widget = new ccui.TextField();
		widget.setPlaceHolder("");
		widget.setString("");
		widget.setFontSize(fontSize);
		widget.setFontName("Arial");
		widget.setMaxLengthEnabled(maxLengthEnable);
		if(maxLengthEnable){
			widget.setMaxLength(maxLength);
		}
		widget.setTextAreaSize(size);
		return widget;
	},
	
	cS9Img:function(imgurl,rect,contentsize,texType){
		texType = texType ? texType : ccui.Widget.LOCAL_TEXTURE;
		var bg = new ccui.ImageView();
		bg.loadTexture(imgurl,texType);
		bg.setScale9Enabled(true);
		bg.setCapInsets(rect);
		bg.setContentSize(contentsize);
		return bg;
	},
	
	cImg:function(imgurl,texType){
		texType = texType ? texType : ccui.Widget.LOCAL_TEXTURE;
		var bg = new ccui.ImageView();
		bg.loadTexture(imgurl,texType);
		return bg;
	},
	
	cBtn:function(imgurl,texType){
		texType = texType ? texType : ccui.Widget.LOCAL_TEXTURE;
		var button = new ccui.Button();
		button.loadTextureNormal(imgurl,texType);
		return button;
	},
	
	cBtnBright:function(imgurl,imgurl1,texType){
		texType = texType ? texType : ccui.Widget.LOCAL_TEXTURE;
		var button = new ccui.Button();
		button.loadTextureNormal(imgurl,texType);
		button.loadTextureDisabled(imgurl1,texType);
		return button;
	},
	
	iBtnText:function(btn,textstr,color,fontsize){
		btn.setTitleText(textstr);
		btn.setTitleColor(color);
		btn.setTitleFontSize(fontsize);
		btn.setTitleFontName("Arial");
		return btn;
	},
	
	/**
	 * 
	 * @param backGroundDic
	 * @param backGroundDisabledDic
	 * @param frontCrossDic
	 * @param {Boolean} selectedState
	 */
	cCbox:function(backGroundDic,backGroundDisabledDic,frontCrossDic,selectedState){
		var widget = new ccui.CheckBox();
		widget.loadTextureBackGround(backGroundDic);
		widget.loadTextureFrontCross(frontCrossDic);
		widget.loadTextureBackGroundDisabled(backGroundDisabledDic);
		widget.setSelected(selectedState);
		return widget;
	}
}