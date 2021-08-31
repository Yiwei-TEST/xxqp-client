//
var ErrorUtil = {

		handle:function(json){
			var code = json.code;
			if(sy.scene)
				sy.scene.hideLoading();
			switch(code){
				case 999:
					FloatLabelUtil.comText(json.errMsg);
					break;
			}
		}
}