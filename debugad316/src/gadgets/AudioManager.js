var AudioManager = {
		
	audioPool : {},
	
	isMusic : true,
	
	isEffects : true,

	reloadFromData:function(music,effect,bgMusic) {
		this.setBgVolume(music / 100);
		this.setEffectsVolume(effect / 100);
		this.isMusic = (music > 0);
		this.isEffects = (effect > 0);
		if (!this.isMusic){
			this.stop_bg();
		}else {
			if(!cc.audioEngine.isMusicPlaying() || this._bgMusic != bgMusic) {
				// this.play_bg("res/audio/bgm" + bgMusic + ".mp3", true);
				this._bgMusic = bgMusic;
			}
			this.setBgVolume(music / 100);
			this.setEffectsVolume(effect / 100);
		}
	},                                                                                   

	/**
	 * 播放音效
	 * url  地址
	 * loop  是否循环
	 */
	play : function(url, loop, volume){
		if(this.isEffects == false) return null;
		this.stop(url);
		var audio = this.audioPool[url];
		if(!audio){
			audio = cc.audioEngine.playEffect(url, loop);	
			this.audioPool[url] = audio;
		}
		if(volume){
			cc.audioEngine.setEffectsVolume(volume);
		}
		return audio;
	},
	/**
	 * 设置音效音量
	 */
	setEffectsVolume : function(value){
		cc.audioEngine.setEffectsVolume(value);
	},
	
	/**
	 * 停止音效
	 */
	stop : function(url){
		var audio = this.audioPool[url];
		if(audio){
			cc.audioEngine.stopEffect(audio);
		}
		this.unload(url);
		audio = null;
	},
	
	/**
	 * 暂停音效
	 */
	pause : function(url){
		var audio = this.audioPool[url];
		if(audio){
			cc.audioEngine.pauseEffect();
		}
	},
	
	/**
	 * 继续播放音效
	 */
	resumePlay : function(url,loop){
		var audio = this.audioPool[url];
		if(audio){
			audio.loop = loop || false;
			cc.audioEngine.resumeEffect(audio);
		}
	},
	
	/**
	 * 播放背景音乐
	 */
	play_bg : function(url,loop,volume){
		if(this.isMusic == false) return null;

		//fuchao 增加背景音乐预加载
		var g_resource = [];
		g_resource.push(url);
		cc.LoaderScene.preload(g_resource,function() {
        	//cc.log("预加载完成");
		 	this.stop_bg();
			 if(!cc.audioEngine.isMusicPlaying()) {
		 		cc.audioEngine.playMusic(url, loop);
			 	cc.audioEngine.setMusicVolume(volume || 0.5);
			 }
		},this);

		return cc.audioEngine;
	},
	
	/**
	 * 停止背景音乐
	 */
	stop_bg : function(){
		cc.audioEngine.stopMusic();
	},
	
	/**
	 * 暂停背景音乐
	 */
	pause_bg : function(){
		if(this.isMusic) {
			cc.audioEngine.pauseMusic();
		}
	},

	
	/**
	 * 继续背景音乐
	 */
	resume_bg : function(){
		if(this.isMusic){
			cc.audioEngine.resumeMusic();
		}
	},
	
	/**
	 * 设置背景音量
	 */
	setBgVolume : function(value){
		//cc.log("修改背景音乐背景音量为：" , value);
		cc.audioEngine.setMusicVolume(value);
	},
	
	/**
	 * 停止全部音效
	 */
	stopAll : function(){
		cc.audioEngine.stopAllEffects();
	},
	
	/**
	 * 卸载音效
	 */
	unload : function(url){
		//cc.audioEngine.unloadEffect(url);
		delete this.audioPool[url];
	},
};