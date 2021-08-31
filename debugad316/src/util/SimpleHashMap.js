/**
 * simple hash map
 * @author zhoufan
 */
var SimpleLinkedMap = 	cc.Class.extend({
	keys:null,
	vals:null,

	ctor:function(){
		this.keys = [];
		this.vals = [];
	},

	put:function(key, value){
		var index = this.getKeyIndex(key);
		if(index<0){
			this.keys.push(key);
			this.vals.push(value);
		}else{
			this.vals[index] = value;
		}
	},

	get:function(key){
		var index = this.getKeyIndex(key);
		return  (index>=0) ? this.vals[index] : null;
	},

	remove:function(key){
		var index = this.getKeyIndex(key);
		if(index>=0){
			this.keys.splice(index,1);
			this.vals.splice(index,1);
		}
	},

	getKeyIndex:function(key){
		return ArrayUtil.indexOf(this.keys,key);
	},

	containsKey:function(key){
		return (this.getKeyIndex(key)>=0);
	},

	size:function(){
		return this.keys.length;
	},

	clear:function(){
		this.keys.length=0;
		this.vals.length=0;
	},

	getKeys:function(){
		return this.keys;
	},

	getValues:function(){
		return this.vals;
	},

	toString:function(){
		var str = "";
		str+="keys::"+JSON.stringify(this.keys);
		str+=" vals::"+JSON.stringify(this.vals);
		return str;
	}
});


var SimpleHashMap = cc.Class.extend({
	
	nowsize:0,
	entry:null,
	
	ctor:function(){
		this.entry = new Object();
		this.nowsize = 0;
	},
	
	put:function(key, value){
		if(!this.containsKey(key)){
			this.nowsize++;
		}
		this.entry[key]=value;
	},
	
	get:function(key){
		return this.containsKey(key) ? this.entry[key] : null;
	},
	
	remove:function(key){  
		if(this.containsKey(key) && ( delete this.entry[key] )){
			this.nowsize--;
		}
	},
	
	containsKey:function(key){
		return (key in this.entry);
	},
	
	size:function(){
		return this.nowsize;
	},
	
	clear:function(){
		this.nowsize = 0;
		this.entry = new Object();
	},
	
	keys:function(){
		var keys=new Array();
		for(var prop in entry)
		{
			keys.push(prop); 
		}
		return keys;
	},
	
	values:function(){
		var values=new Array();
		for(var prop in entry)
		{
			values.push(entry[prop]);
		}
		return values;
	}
});