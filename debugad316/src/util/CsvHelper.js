/**
 * 获取csv数据 csvhelper.getData1
 * @author zhoufan
 * @date 2014年10月20日
 * @version v1.0
 */
var CsvHelper = cc.Class.extend({
	
	buildId:function(id){
		return "id"+id;
	},
	/**
	 * 格式化字符串<br>
	 * e.g. strFormat("人物等级{0}开启",15)  人物等级15开启
	 * @returns {String}
	 */
	strFormat:function() {
		if (arguments.length == 0)
			return null;
		var str = arguments[0];
		if(!str){
			cc.log("erro:"+arguments[1]);
		}
		for (var i = 1; i < arguments.length; i++) {
			var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
			str = str.replace(re, arguments[i]);
		}
		return str;
	},
	
	awardFormat:function(award){
		var result = "";
		for(var key in award){
			var value = award[key];
			var string = langcsv[key+"j"];
			if(value && parseInt(value)>0 && string){
				result += this.strFormat(string+" ","*",value);
			}
		}
		if(award.item){
			var i1 = award.item.split(";");
			for (var i = 0; i < i1.length; i++) {
				var ele = i1[i].split(",");
				var item = this.getData(itemcsv, ele[0]);
				result+=" ";
				result+=item.szName;
				result+="*"+ele[1];
			}
		}
		if(award.items){
			var map = award.items;
			for(var key in map){
				var item = this.getData(itemcsv, key);
				result+=" ";
				result+=item.szName;
				result+="*"+map[key];
			}
		}
		return result;
	},
	
	/**
	 * 获取csv数据
	 * @param {Object} source
	 * @param {Integer} id
	 * @returns {Object}
	 */
	getData:function(source,id){
		var array = source.rows[this.buildId(id)];
		if(!array){
			cc.log("csv not found:"+id);
			return null;
		}
		var result = {};
		for(var i in source.header){
			result[source.header[i]] = array[i];
		};
		return result;
	},
	
	/**
	 * 获取装备强化数据
	 * @param equipId
	 * @param slevel
	 * @returns
	 */
	getEquipStrength:function(equipId,slevel){
		var result = null;
		var equip = this.getData(equip_datacsv, equipId);
		var dataSource = equipStrengthcsv.rows;
		for(var key in dataSource){
			var row = dataSource[key];
			if(row[1] == slevel && row[2] == equip.iLevel){
				result = this.getData(equipStrengthcsv, row[0]);
				break;
			}
		}
		return result;
	},
	
	/**
	 * 根据奖励包id获取奖励
	 * @param id
	 * @returns
	 */
	getAwardInfo:function(id){
		var infoName = {"coin":"金币","bdyuanBao":"绑定钻石","yuanbao":"钻石","honor":"荣誉","devote":"贡献","ghexp":"战盟经验","prestigeVal":"声望"};
		var info = this.getData(awardInfocsv, id);
		var awards = [],obj = {},arr = [],arr1 = [];
		for(var key in info){
			if(key == "ID") continue;
			var _data = {};
			if(key == "equip"){
				if(info[key] != ""){
					arr1 = info.equip.split(";");
					for(var i = 0; i < arr1.length; i++){
						_data = {};
						arr = arr1[i].split(",");
						obj = this.getData(equip_datacsv,arr[0]);
						var iconPath = obj.iIcon == 0 ? obj.eid : obj.iIcon;
						_data.name = obj.szName;
						_data.num = 1;
						_data.quality = arr[1];
						_data.icon = "res/equip/"+iconPath+".png";
						_data.id = obj.ID;
						_data.type = 0;
						awards.push(_data);
					}
				}
			}
			else if(key == "item"){
				if(info[key] != ""){
					arr1 = info.item.split(";");
					for(i = 0; i < arr1.length; i++){
						_data = {};
						arr = arr1[i].split(",");
						obj = this.getData(itemcsv,arr[0]);
						_data.name = obj.szName;
						_data.num = arr[1];
						_data.icon = "res/item/"+obj.iIcon;
						_data.id = obj.ID;
						_data.type = 1;
						_data.quality = 1;
						awards.push(_data);
					}
				}
			}
			else if(key == "qiling"){
				if(info[key] != ""){
					arr1 = info.qiling.split(";");
					for(var i = 0; i < arr1.length; i++){
						_data = {};
						arr = arr1[i].split(",");
						obj = this.getData(qilingcsv,arr[0]);
						var iconPath = obj.iIcon == 0 ? obj.eid : obj.iIcon;
						_data.name = obj.szName;
						_data.num = 1;
						_data.quality = arr[1];
						_data.icon = "res/skill/"+iconPath+".png";
						_data.id = obj.ID;
						_data.type = 2;
						awards.push(_data);
					}
				}
			}
			else{
				if(parseInt(info[key]) > 0){
					_data.name = langcsv["csvhelper"+key];
					_data.num = info[key];
					_data.icon = "res/item/"+key+".png";
					_data.quality = 1;
					awards.push(_data);
				}
			}
		}
		return awards;
	},
	
	getAwardNames : function(awardId){
		var awards = this.getAwardInfo(awardId);
		var names = "";
		var len = awards.length;
		for(var i = 0; i < len; i++){
			names += awards[i].name + "*"+awards[i].num;
			if(i != len-1){
				names += ",";
			}
		}
		return names;
	},
	
	getArenaAward : function(rank){
		var dataSource = arenacsv.rows;
		var awardId = null;
		for(var key in dataSource){
			var dataArray = dataSource[key];
			var region = parseInt(dataArray[0]);
			var award = dataArray[1];
			if(rank <= region) {
				awardId = award;
				break;
			}
		}
		if(awardId != null){
			return this.awardFormat(this.getData(awardInfocsv, awardId));
		}else{
			return this.awardFormat(this.getData(awardInfocsv, award));
		}
	},
	
	getKfArenaAward : function(rank){
		var dataSource = kuafu_arenacsv.rows;
		var awardId = null;
		for(var key in dataSource){
			var dataArray = dataSource[key];
			var region = parseInt(dataArray[0]);
			var award = dataArray[1];
			if(rank <= region) {
				awardId = award;
				break;
			}
		}
		if(awardId != null){
			return this.awardFormat(this.getData(awardInfocsv, awardId));
		}else{
			return this.awardFormat(this.getData(awardInfocsv, award));
		}
	},
	
	/**
	 * 获取已经组织好了的随机姓名数据
	 * @returns {Object}
	 */ 
	getAllRandomName:function(){
		var result = {};
		result.familyName = [];
		result.womanName = [];
		result.manName = [];
		var dataSource = randomNamecsv.rows;
		for(var key in dataSource){
			var dataArray = dataSource[key];
			var header = randomNamecsv.header;
			for(var j=0;j<dataArray.length;j++){
				var row = dataArray[j];
				var column = header[j];
				if(column != "id" && row != ""){
					result[column].push(row);
				}
			}
		}
		return result;
	},
	
	getMaxMapId:function(){
		var dataSource = map_datacsv.rows;
		var maxId = 0;
		for(var key in dataSource){
			var dataArray = dataSource[key];
			var id = parseInt(dataArray[0]);
			if(id > maxId){
				maxId = id;
			}
		}
		return maxId;
	},

	getMonsterOffset:function(mname,maction){
		var key = mname+"_"+maction;
		var data = this.getData(monster_offsetcsv,key);
		if(!data)
			data = this.getData(monster_offsetcsv,"m10_"+maction);
		return data;
	},

	getShizhuangPath:function(id,column,job){
		var data = this.getData(shizhuangcsv,id);
		var jobs = [1,2,4];
		var path = data[column].split(",");
		return path[ArrayUtil.indexOf(jobs,job)];
	}
});

var csvhelper = new CsvHelper();