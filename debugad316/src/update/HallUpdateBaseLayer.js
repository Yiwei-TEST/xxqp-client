/**
* leiwenwen
* 2019/09/28
**/

//var HelpTool = {
//    _require_script_map:{},
//
//    requireScript:function(){
//        if(HelpTool._require_script_map[path]){
//            // xiaohei 如果是开发模式每次都重新require文件，在ScriptingCore中重新编译该文件，只有传入needReload为true才能重新加载（有些共享内存不能重新加载）
//            if((g_targetOS == TargetOS.WINDOWS) && needReload){
//                __cleanScript(path);
//                require(path);
//            }
//            return;
//        }else{
//            require(path);
//            HelpTool._require_script_map[path]  = true;
//        }
//    }
//};

var HallUpdateBaseLayer = cc.Layer.extend({
    _loaderQueue:[],
    _isLoading:false,
    _isStop:false,
    _dt:0,
    _projectPath:null,
    _jsListPath:null,
    _am:null,
    _roundProgress:null,
    _gameType:null,
    _callBack:null,
    _isShowAni:false,
    _percent:0,
    _timeId:null,



    ctor:function(){
        this.json = "res/loadingUpdate.json";
        this._super(this.json);
        this._loaderQueue = [];
        this._isLoading = false;
        this._isStop = false;
        this._dt = 0;
        this._projectPath = null;
        this._am = null;
        this._jsListPath = null;
        this._gameType = null;
        this._callBack = null;
        this._isShowAni = false;
        this._percent = 0;
        this._timeId = null;

        this.loadData = {};

        this.selfRender();
    },

    selfRender : function(){
        //
        this.grayBg = new cc.LayerColor(cc.color(0,0,0,180));
        this.addChild(this.grayBg);

        this.root = ccs.uiReader.widgetFromJsonFile(this.json);
        this.root.setPosition((cc.winSize.width - this.root.width)/2,(cc.winSize.height - this.root.height)/2);
        this.root.setBackGroundColorOpacity(0);
        this.addChild(this.root);

        this.main2 = this.getWidget("main2");

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/loading/loading.ExportJson");

        this.loadAni = new ccs.Armature("loading");
        this.loadAni.setPosition(this.root.width/2 ,this.root.height/2+40);
        this.loadAni.getAnimation().play("Animation1",-1,1);
        this.root.addChild(this.loadAni);

        var labelLabel = this.labelLabel = this.getWidget("Label_35");
        this.labelLabel.setString("加载中...");


        ////圆形进度条太花....恩 太花...
        this._roundProgress = new RoundProgress(
                "res/ui/common/update1.png",
                "res/ui/common/update2.png");
        //this._roundProgress.scale = 0.6;
        this.main2.addChild(this._roundProgress,2);
        this._roundProgress.setPosition(this.main2.width/2,this.main2.height/2 -105);


        var closeBtn = this.closeBtn = new ccui.Button("res/ui/common/pop_btn_close.png");
        closeBtn.setPosition(this.width - 150,this.height - 150);
        this.addChild(closeBtn,3);

        UITools.addClickEvent(closeBtn,this,this.onHide);


        //this.scheduleUpdate();
    },

    /**
     * 获取内部元素
     * @param name  部件名
     */
    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

    onTouchBegan:function(){
        return true;
    },

    /**
     * _gameType游戏类型
     * _callBack回调函数
     */
    getUpdatePath:function(_gameType,_callBack){
        var updateData = GameTypeManager.getGameInfo(_gameType);
        this._gameType = _gameType || null;
        this._callBack = _callBack || null;
        if (updateData){
            this._projectPath = updateData.projectPath || null;
            this._jsListPath = updateData.jsListPath || null;
            //cc.log("getUpdatePath===",_gameType,this._projectPath,this._jsListPath)
            this._isShowAni = true;
        }
        this.closeBtn.visible = false;
        this._percent = 0;
        this.checkUpdate();

    },

    getGameType:function(){
        return this._gameType;
    },

    checkUpdate:function(){
        var IGNORE_HOTUPDATE = true;
        if(IGNORE_HOTUPDATE || !this._projectPath){
            cc.log("checkUpdate::IGNORE_HOTUPDATE....cancel");
            this.loadChildGame();
            return;
        }
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
        this._am = new jsb.AssetsManager("" + this._projectPath, storagePath);
        this._am.retain();
        if (!this._am.getLocalManifest().isLoaded()) {
            cc.log("Fail to update assets, step skipped.");
            this.loadChildGame();
        } else {
            var that = this;
            this.updateLoadingBar(0);
            var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
                cc.log("event.getEventCode()===",event.getEventCode(),that._percent)
                switch (event.getEventCode()){
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        cc.log("No local manifest file found, skip assets update.");
                        that.loadChildGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        //clearTimeout(that.timeId);
                        if (that._percent && that._percent > 2){
                            that.onShow();
                        }
                        that._percent = event.getPercent();
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        cc.log("Fail to download manifest file, update skipped.");
                        that.loadChildGame();
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        cc.log("ALREADY_UP_TO_DATE.");
                        that.loadChildGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        cc.log("Update finished.");
                        that.loadChildGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        cc.log("Update failed. " + event.getMessage());
                        failCount++;
                        if (failCount < maxFailCount)
                        {
                            that._am.downloadFailedAssets();
                        }else{
                            cc.log("Reach maximum fail count, exit update process");
                            var popup = new AssetsUpdateFailedPopup();
                            that.addChild(popup,100);
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        cc.log("ERROR_DECOMPRESS. " + event.getMessage());
                        that.loadChildGame();
                        break;
                    default:
                        break;
                }
            });
            cc.eventManager.addListener(listener, 1);
            this._am.update();
        }
        this.scheduleUpdate();
    },
    /**
     * scheduler
     * @param dt
     */
    update: function(dt) {
        this._dt += dt;
        if (this._dt > 1){
            this._dt = 0;
            this._percent  = this._percent + 1;
            if (this._percent && parseInt(this._percent) <= 100){
                var p = parseInt(this._percent);
                this.updateLoadingBar(p);
            }
        }
    },

    updateLoadingBar:function(percent){
        var str = "加载中...";
        if(percent > 0){
            str = "加载中..." + percent + "%"
        }
        this.labelLabel.setString(str);
        this._roundProgress.setPercentage(percent);
    },

    loadChildGame:function(){
        if(this._roundProgress){
            this.unscheduleUpdate();
            this.updateLoadingBar(100);
        }
        //jsList是jsList.js的变量，记录全部js。
        var self = this;
        if (self._jsListPath && !this.loadData[self._jsListPath]){
            this.scheduleOnce(function(){
                self.loadData[self._jsListPath] = true;
                cc.loader.loadJs([""+self._jsListPath], function(){
                    cc.loader.loadJs(jsList, function(){
                        self.onHide();
                        self.closeBtn.visible = true;
                        GameTypeManager.pushLoadGametype(self._gameType);
                        if (self._callBack){
                            self._callBack();
                            self._callBack = null;
                        }
                        //更新完成
                    });
                });
            }, 0.3);
        }else{
            self.onHide();
            if (self._callBack){
                self._callBack();
                self._callBack = null;
            }
        }
    },
    onShow:function(){
        //cc.log("===onShow===")
        this.visible = true;
    },

    onHide:function(){
        this._percent = 0;
        this.unscheduleUpdate();
        this.visible = false;
        if(this._am){
            this._am.release();
        }
    },

    onRemove:function(){
        cc.log("HallUpdateBaseLayer::onExit");
        if(this._am){
            this._am.release();
        }
        //this._super();
    }

})

