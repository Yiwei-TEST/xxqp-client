/**
 * labelttf和textfiled的包装类  方便以后统一更换字体
 * @author zhoufan
 * @date 2014年10月22日
 * @version v1.0
 */
var CustomText = {
	defaultFontName:"Arial",
	
	create:function(label, fontSize, dimensions, color, hAlignment, vAlignment){
		var text = new cc.LabelTTF(label,this.defaultFontName,fontSize,dimensions);
		if(dimensions)	text.setDimensions(dimensions);
		if(color) 	text.setColor(color);
		if(hAlignment)	text.setHorizontalAlignment(hAlignment);
		if(vAlignment){
			text.setVerticalAlignment(vAlignment);
		}else{
			text.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		}
		return text;
	}
}

var CustomTextUtil = {

	/**
	 * 截取出适合于固定宽度label的文本
	 * @param originalStr {String}
	 * @param fixedWidth {Number}
	 * @param fontSize {Number}
	 * @returns {String}
	 */
	subTextWithFixWidth: function(originalStr, fixedWidth, fontSize) {
		var length = originalStr.length;
		var tlableForSize = null;
		var fixedStr = originalStr;
		var tempStr = originalStr;
		var tWidth = 0;
		for (var curLenght = 2 ; curLenght <= length ; curLenght ++) {
			tempStr = originalStr.substring(0 , curLenght);
			tlableForSize = new cc.LabelTTF(tempStr, "Arial", fontSize);
			tWidth = tlableForSize.width;
			if(tWidth >= fixedWidth){
				fixedStr = originalStr.substring(0 , curLenght - 1);
				break;
			}
		}
		return fixedStr;
	}
}

/**
 * RichLabel的数据映射
 * @type {{type: number, color: string, opacity: number, text: string, fontSize: number, filePath: string}}
 */
var RichLabelVo = {
	color:"",
	opacity:0,
	text:"",
	fontSize:0,
	filePath:"",

	/**
	 * 获取RichElementVo
	 * @returns {RichLabelVo}
	 */
	createTextVo:function(text,color,fontSize){
		return {type:0,color:color,text:text,fontSize:fontSize,filePath:"",opacity:255};
	},

	/**
	 * 获取RichElementVo
	 * @returns {RichLabelVo}
	 */
	createImageVo:function(filePath){
		return {type:1,filePath:filePath,opacity:255};
	}
};

var CustomRichText =  ccui.Widget.extend({
	ctor: function () {
		ccui.Widget.prototype.ctor.call(this);
		this._richElements = [];
		this._elementRenders = [];
		this._leftSpaceWidth = 0;
		this._verticalSpace = 0;
		this.setAnchorPoint(0,0);
		this._initRenderer();
	},
	setVerticalSpace:function(verticalSpace){
		this._verticalSpace = verticalSpace;
	},
	_initRenderer: function () {
		this._elementRenderersContainer = new cc.Node();
		this._elementRenderersContainer.setAnchorPoint(0, 0);
		this.addChild(this._elementRenderersContainer, 0, -1);
	},
	setContentSize: function(contentSize, height){
		var locWidth = (height === undefined) ? contentSize.width : contentSize;
		var locHeight = (height === undefined) ? contentSize.height : height;
		ccui.Widget.prototype.setContentSize.call(this, locWidth, locHeight);
		this._customSize = cc.size(locWidth,locHeight);
	},
	pushBackElement: function (element) {
		this._richElements.push(element);
	},
	formatText: function () {
		this._elementRenderersContainer.removeAllChildren();
		this._elementRenders.length = 0;
		var i, element, locRichElements = this._richElements;
		this._addNewLine();
		for (i = 0; i < locRichElements.length; i++) {
			element = locRichElements[i];
			switch (element.type) {
				case 0:
					this._handleTextRenderer(element.text, element.fontName, element.fontSize, element.color);
					break;
				case 1:
					this._handleImageRenderer(element.filePath);
					break;
				default:
					break;
			}
		}
		this.formatRenderers();
	},
	_handleTextRenderer: function (text, fontName, fontSize, color) {
		var textRenderer =  new cc.LabelTTF(text, fontName, fontSize);
		var textRendererWidth = textRenderer.getContentSize().width;
		this._leftSpaceWidth -= textRendererWidth;
		if (this._leftSpaceWidth < 0) {
			var overstepPercent = (-this._leftSpaceWidth) / textRendererWidth;
			var curText = text;
			var stringLength = curText.length;
			var leftLength = stringLength * (1 - overstepPercent);
			var leftWords = curText.substr(0, leftLength);
			var cutWords = curText.substr(leftLength, curText.length - 1);
			if (leftLength > 0) {
				var leftRenderer = new cc.LabelTTF(leftWords.substr(0, leftLength), fontName, fontSize);
				leftRenderer.setColor(color);
				leftRenderer.setOpacity(color.a);
				this._pushToContainer(leftRenderer);
			}
			this._addNewLine();
			this._handleTextRenderer(cutWords, fontName, fontSize, color);
		} else {
			textRenderer.setColor(color);
			textRenderer.setOpacity(color.a);
			this._pushToContainer(textRenderer);
		}
	},
	_handleImageRenderer: function (filePath) {
		var imageRenderer = new cc.Sprite(filePath);
		this._handleCustomRenderer(imageRenderer);
	},
	_handleCustomRenderer: function (renderer) {
		var imgSize = renderer.getContentSize();
		this._leftSpaceWidth -= imgSize.width;
		if (this._leftSpaceWidth < 0) {
			this._addNewLine();
			this._pushToContainer(renderer);
			this._leftSpaceWidth -= imgSize.width;
		} else
			this._pushToContainer(renderer);
	},
	_addNewLine: function () {
		this._leftSpaceWidth = this._customSize.width;
		this._elementRenders.push([]);
	},
	formatRenderers: function () {
		var newContentSizeHeight = 0, locRenderersContainer = this._elementRenderersContainer;
		var locElementRenders = this._elementRenders;
		var i, j, row, nextPosX, l;
		var maxHeights = [];
		for (i = 0; i < locElementRenders.length; i++) {
			row = locElementRenders[i];
			var maxHeight = 0;
			for (j = 0; j < row.length; j++) {
				l = row[j];
				maxHeight = Math.max(l.getContentSize().height, maxHeight);
			}
			maxHeights[i] = maxHeight;
			newContentSizeHeight += maxHeight;
		}
		var nextPosY = this._customSize.height;
		var locLength = locElementRenders.length;
		for (i = 0; i < locLength; i++) {
			row = locElementRenders[i];
			nextPosX = 0;
			var n=i+1;
			nextPosY = 0;
			for(;n<locLength;n++){
				nextPosY += maxHeights[n]+this._verticalSpace;
			}
			for (j = 0; j < row.length; j++) {
				l = row[j];
				l.setAnchorPoint(cc.p(0, 0));
				l.setPosition(cc.p(nextPosX, nextPosY));
				locRenderersContainer.addChild(l, 1);
				nextPosX += l.getContentSize().width;
			}
		}
		locRenderersContainer.setContentSize(this._customSize.width,newContentSizeHeight);
		var length = locElementRenders.length;
		for (i = 0; i<length; i++){
			locElementRenders[i].length = 0;
		}
		this._elementRenders.length = 0;
		locRenderersContainer.setPosition(0,0);
	},
	_pushToContainer: function (renderer) {
		if (this._elementRenders.length <= 0)
			return;
		this._elementRenders[this._elementRenders.length - 1].push(renderer);
	},
	getVirtualRendererSize: function(){
		return this._elementRenderersContainer.getContentSize();
	}
});

var RichLabel = ccui.Widget.extend({
	ctor: function(contentSize,verticalSpace) {
		this._super();
		this.anchorX=this.anchorY=0;
		this.wSize = contentSize.width;
		var richText = this._richText = new CustomRichText();
		richText.setContentSize(cc.size(contentSize.width,contentSize.height));
		richText.setAnchorPoint(cc.p(0,0));
		richText.setVerticalSpace(verticalSpace);
		richText.x=richText.y=0;
		this.addChild(richText,10);
	},
	setLabelString: function(elements) {
		var length = elements.length;
		for(var i=0;i<length;i++){
			this._richText.pushBackElement(elements[i]);
		}
		this._richText.formatText();
		this.setContentSize(this.wSize,this.getLabelHeight());
		this._richText.x=this._richText.y = 0;
	},
	getLabelHeight: function() {
		return this._richText.getVirtualRendererSize().height;
	}
});
