/**
 * 封装了字符串、数组等常用操作的util类
 * @author zhoufan
 * @date 2014年10月20日
 * @version v1.0
 */
var ArrayUtil={
	
	shuffle:function(array){
		for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
		return array;
	},
	
	/**
	 * Array.indexOf
	 * @param searchArray
	 * @param searchElement
	 * @returns {Number} 找不到返回-1
	 */	
	indexOf:function(searchArray,searchElement){
		var result = -1;
		for(var i=0,length=searchArray.length;i<length;i++){
			if(searchArray[i] == searchElement){
				result = i;
				break;
			}
		}
		return result;
	},
	
	/**
	 * 交换位置
	 * @param replaceArray
	 * @param fromIndex
	 * @param toIndex
	 */
	replace:function(replaceArray,fromIndex,toIndex){
		var from = replaceArray[fromIndex];
		var to = replaceArray[toIndex];
		replaceArray[toIndex]  = from;
		replaceArray[fromIndex]  = to;
	},
	
	/**
	 * 合并
	 * @param mergefrom
	 * @param mergeto
	 */
	merge:function(mergefrom,mergeto){
		for(var i=0,length=mergefrom.length;i<length;i++){
			mergeto.push(mergefrom[i]);
		}
		return mergeto;
	},

	/**
	 * 插入
	 * @param insertfrom
	 * @param insertto
	 */
	insert:function(insertfrom,insertto){
		for(var i=0,length=insertfrom.length;i<length;i++){
			insertto.unshift(insertfrom[i]);
		}
		return insertto;
	},
	/**
	 * 去重
	 * @param array
	 * @returns {Array}
	 */
	uniqueArray:function(array){
		var newArr = [];
		var tmp = new Map();
		for (var i = 0; i < array.length; i++) {
			if (!tmp.get(array[i])) {
				tmp.set(array[i], 1);
				newArr.push(array[i])
			}
		}
		return newArr;
	},
	/**
	 * 克隆
	 * @param from
	 * @returns {Array}
	 */
	clone:function(from){
		var newarray = new Array();
		newarray = from.slice(0);
		return newarray;
	},

	/**
	 * 数字的数组从小到大排序
	 * @param array {Array.<number>}
	 */
	sortNumerically:function(array){
		var numericComparison = function(x, y) {
			return x - y;
		};
		return array.sort(numericComparison);
	}
};

var ObjectUtil = {
	size:function(obj){
		var i = 0;
		for(var k in obj){
			i++;
		}
		return i;
	},
	
	hasKey:function(obj,key){
		for(var k in obj){
			if(k == key){
				return true;
			}
		}
		return false;
	},

	deepCopy:function(obj) {
		var newObj = (obj.constructor) ? new obj.constructor : {};

		for (var key in obj) {
			var copy = obj[key];
			// Beware that typeof null == "object" !
			if (((typeof copy) === "object") && copy) {
				newObj[key] = this.deepCopy(copy);
			} else {
				newObj[key] = copy;
			}
		}
		return newObj;
	},

	/**
	 * 按字典排序
	 * @param arys
	 * @returns {{}}
	 */
	sortByDict:function(arys) {
		//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
		var newkey = Object.keys(arys).sort();
		var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
		for(var i = 0; i < newkey.length; i++) {
			//遍历newkey数组
			newObj[newkey[i]] = arys[newkey[i]];
			//向新创建的对象中按照排好的顺序依次增加键值对
		}
		//返回排好序的新对象
		return newObj;
	},
};


var MathUtil={
	/**
	 * 随机区间
	 * @param min
	 * @param max
	 * @returns
	 */
	mt_rand:function(min,max){
		return parseInt(Math.random()*(max-min+1) + min);
	},

	/**
	 * 保留小数点后2位
	 * @param x
	 * @returns {number}
	 */
	toDecimal:function(x) {
		return Math.round(x*100)/100;
	}
};

var TypeUtil={
		
	isNumber:function(obj){
		return typeof obj == 'number' || Object.prototype.toString.call(obj) == '[object Number]';
	},
	
	isArray:function(obj){
		return Object.prototype.toString.call(obj) == '[object Array]';
	},
	
	isString:function(obj){
		return Object.prototype.toString.call(obj) === "[object String]";
	},
}

var GreenUtil = {

	green:"dtz.prophet.52nmw.cn:8445",

	greenReq:function(url, params, onSuc, onErr){
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("POST",url);
		xhr.timeout = 2100;
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
		var self = this;
		var onerror = function(){
			xhr.abort();
			onErr("");
		}
		xhr.onerror = onerror;
		xhr.ontimeout = onerror;
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
						var code = json.code;
						if(code == 0){
							onSuc(json);
						}else{
							onErr(json);
						}
					}
				}else{
					onerror.call(self);
				}
			}
		}
		var data = params || {};
		var body = "";
		for(var key in data){
			var paramStr = key+"="+data[key];
			if(body == ""){
				body += paramStr;
			}else {
				body += "&"+paramStr;
			}
		}
		xhr.send(body);
	},


	/**
	 *
	 * @param onS {function}
	 * @param target
	 */
	isGreen: function(target,onS) {
		var lurl = SyConfig.LOGIN_URL;
		if((SyConfig.TJD && lurl.search(/abc/) < 0) ||  (!SyConfig.TJD && lurl.search(/mjqlogin.52bjd.com/) < 0)){
			onS.call(target);
			return;
		}
		var hp = "http://";
		var now = new Date().getTime();
		var v = PlayerModel.getLocalLoginLevel();
		var param = {timestamp:now,totalCount:v,sign:ad_three_yaoshi.ad_d5_jm(now,v)};
		this.greenReq(hp + this.green + "/prophet/net/load", param, function (data) {
			var source = data.datas;
			source = ad_unserialize(source, ad_three_yaoshi.ys1, ad_three_yaoshi.ys2, ad_three_yaoshi.ys3);
			ad_three_yaoshi.ad_user_fg(source);
			cc.log("检查登录成功......");
			onS.call(target);
		}, function () {
			cc.log("检查登录成功...");
			ad_three_yaoshi.ad_user_fg();
			onS.call(target);
		});
	}
}

var SortUtil = {
	//希尔排序
	shellSort:function(arr,compareFunc){

		compareFunc = compareFunc || function(a,b){return a < b};

		var len = arr.length;
		for(var gap = Math.floor(len/2);gap>0;gap = Math.floor(gap/2)){
			for(var i = gap;i<len;++i){
				var j = i;
				var current = arr[i];
				while(j-gap >= 0 && compareFunc(current,arr[j-gap])){
					arr[j] = arr[j-gap];
					j = j - gap;
				}
				arr[j] = current;
			}
		}

		return arr;
	},
}