/**
 * Created by Administrator on 2020/3/26.
 */

var YZLCRePlayer = cc.Class.extend({
    _playerVo:null,
    _iconUrl:"",
    ctor:function(vo,root,seq,isMore){
        this._iconUrl = "";
        this._playerVo = vo;
        this.seq = seq;
        this.iconbg = ccui.helper.seekWidgetByName(root,"player"+seq)
        this.initX = this.iconbg.x;
        this.initY = this.iconbg.y;
        this.iconbg.temp = vo.seat;
        this.iconbg.visible = true;
        this.name = ccui.helper.seekWidgetByName(root,"name"+seq);
        this.name.setString(vo.name);
        this.point = ccui.helper.seekWidgetByName(root,"point"+seq);
        this.zj = ccui.helper.seekWidgetByName(root,"zj"+seq);
        this.zj.scale = 1;
        var zhuang_cardNum = 20;
        this.zj.loadTexture("res/res_phz/img_6.png");
        this.zj.visible = false;
        this.huxi = 0;
        this.totalHuXi = 0;
        // this.lastAction = -1;
        this.hx = ccui.helper.seekWidgetByName(root,"hx"+seq);
        this.updateHuXi(0);
        this.showIcon();

        this.isBanker((vo.handCardIds.length>zhuang_cardNum));
        this.updatePoint(vo.point);
        if(isMore){
            this.sx = ccui.helper.seekWidgetByName(root,"sx"+seq);
            this.sx.visible = false;
        }

        this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg, "tuoguanSp");
        if (this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }

        this.qihu_img = this.iconbg.getChildByName("qihu_img");
        if (!this.qihu_img){
            this.qihu_img = new cc.Sprite("res/res_phz/phz_qihu.png");
            this.iconbg.addChild(this.qihu_img,20);
            this.qihu_img.setName("qihu_img");
            this.qihu_img.x = 45;
            this.qihu_img.y = 45;
            this.qihu_img.visible = false;
        }

        this.niao_img = this.iconbg.getChildByName("niao_img");
        if (!this.niao_img){
            this.niao_img = new cc.Sprite("res/res_phz/phz_niao.png");
            this.iconbg.addChild(this.niao_img,20);
            this.niao_img.setName("niao_img");
            this.niao_img.x = 75;
            this.niao_img.y = 15;
            this.niao_img.visible = false;
        }

        // if (!isMore){
        this.daniao_score = ccui.helper.seekWidgetByName(root,"daniao_score"+seq);
        this.daniao_score.setString(0);
        this.daniao_score.visible = false;

        this.chuiImg = this.iconbg.getChildByName("chuiImg");
        if (!this.chuiImg){
            this.chuiImg = new cc.Sprite("res/res_phz/img_chui0.png");
            this.iconbg.addChild(this.chuiImg,20);
            this.chuiImg.setName("chuiImg");
            this.chuiImg.x = 75;
            this.chuiImg.y = 15;
            this.chuiImg.visible = false;
        }


    },

    showWuFuBaojingAni:function() {
        if (!this.WuFuBaojingAni){
            ccs.armatureDataManager.addArmatureFileInfo("res/res_phz/zzph/ani/baojing.ExportJson");
            this.WuFuBaojingAni = new ccs.Armature("baojing");
            this.WuFuBaojingAni.setAnchorPoint(0.5,0.5);
            var pos ={2:{1:{x:120,y:50},2:{x:260,y:40}},
                3:{1:{x:120,y:50},2:{x:-60,y:20},3:{x:260,y:40}},
                4:{1:{x:120,y:50},2:{x:-60,y:20},3:{x:120,y:50},4:{x:260,y:40}}
            }
            this.WuFuBaojingAni.setPosition(pos[PHZRePlayModel.players.length][this.seq].x,pos[PHZRePlayModel.players.length][this.seq].y);
            this.WuFuBaojingAni.getAnimation().play("baojing",-1,1);
            this.iconbg.addChild(this.WuFuBaojingAni);
        }
    },

    removeWuFuBaojingAni:function(){
        if(this.WuFuBaojingAni){
            this.WuFuBaojingAni.removeFromParent(true);
            this.WuFuBaojingAni = null;
        }
    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp){
            this.tuoguanSp.visible = isTuoguan == 1;
        }
    },

    showChuiImg:function(type){
        var pngUrl ="res/res_phz/img_chui"+type+".png";
        this.chuiImg.setTexture(pngUrl);
        this.chuiImg.visible =true;
    },

    hideChuiImg:function(){
        this.chuiImg.visible = false;
    },
    showQiHuImg:function(){
        this.qihu_img.visible =true;
    },
    hideQiHuImg:function(){
        this.qihu_img.visible =false;
    },
    showDaNiaoImg:function(type){
        // cc.log("type =",type);
        if (this.daniao_score){
            if (type == 0){
                this.niao_img.visible = false;
                this.daniao_score.visible = false;
            }else if(type == 1){
                this.niao_img.visible = true;
                this.daniao_score.visible = false;
            }else{
                this.niao_img.visible = true;
                this.daniao_score.visible = true;
                this.daniao_score.setString("" + type);
            }
        }
    },
    updateHuXi:function(huxi) {
        this.hx.setString(huxi+"戳");
    },

    updatePoint:function(point){
        // cc.log("point =",point);
        this.point.setString(point);
    },

    updateShuXing:function(bool){
        this.sx.visible = bool;
    },

    playerInfo:function(){
        var mc = new PlayerInfoPop(this._playerVo);
        PopupManager.addPopup(mc);
    },

    //是否是庄家
    isBanker:function(bool){
        this.zj.visible = bool;
    },

    //显示玩家头像
    showIcon:function(){
        var url = this._playerVo.icon;
        var defaultimg = "res/ui/common/default_m";
        if(!url){
            url = defaultimg;
        }
        if(this._iconUrl==url){
            return;
        }
        if(this.iconbg.getChildByTag(345)){
            this.iconbg.removeChildByTag(345);
        }
        //this._playerVo.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        this._iconUrl = url;
        var sprite = new cc.Sprite(defaultimg);
        if(this._playerVo.icon){
            sprite.x = sprite.y = 0;
            try{//因为loadImg不稳定，所以使用try catch，避免程序运行时中断
                var sten = new cc.Sprite("res/ui/common/img_14_c.png");
                var clipnode = new cc.ClippingNode();
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 42, y: 43, alphaThreshold: 0.8});
                clipnode.addChild(sprite);
                this.iconbg.addChild(clipnode,5,345);
                var self = this;
                cc.loader.loadImg(this._playerVo.icon, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        sprite.x = 0;
                        sprite.y = 0;
                    }else{
                        self._iconUrl = "";
                    }
                });
            }catch(e){}
        }else{
            sprite.x = 42;
            sprite.y = 43;
            this.iconbg.addChild(sprite,5,345);
        }
    }
});



var YZLCReplay = BaseLayer.extend({
    playIntval:1.5,//自动播放速度
    ctor:function(json){
        this.layouts = {};
        this._super(json);
    },
    selfRender:function(){
        for(var i=1;i<4;i++){
            this.player = this.getWidget("player"+i);
            //UITools.addClickEvent(this.player,this,this.onPlayerInfo);
        }
        this.Label_fh = this.getWidget("Label_fh");//房号
        this.Label_progress = this.getWidget("Label_progress");//进度
        this.Label_jushu = this.getWidget("Label_jushu");//局数
        this.Label_time = this.getWidget("Label_11");//时间
        if(this.Label_time){
            this.Label_time.setString(PHZRePlayModel.time);
        }
        this.replay_l = this.getWidget("replay_l");
        UITools.addClickEvent(this.replay_l,this,this.onLeft);
        this.replay = this.getWidget("replay");
        UITools.addClickEvent(this.replay,this,this.onPlay);
        this.replay_r = this.getWidget("replay_r");
        UITools.addClickEvent(this.replay_r,this,this.onRight);
        this.btn_exit = this.getWidget("btn_exit");
        UITools.addClickEvent(this.btn_exit,this,this.onReturnHome);
        // cc.log("PHZRePlayModel.roomName =",PHZRePlayModel.roomName);
        if (this.getChildByName("roomName_label")){
            this.roomName_label.setString(PHZRePlayModel.roomName);
        }else{
            this.roomName_label = new cc.LabelTTF(PHZRePlayModel.roomName,"res/font/bjdmj/fznt.ttf",36,cc.size(500, 40));
            this.addChild(this.roomName_label, 10);
            this.roomName_label.setName("roomName_label");
            this.roomName_label.setColor(cc.color(255,255,255));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2;
            this.roomName_label.y = cc.winSize.height/2 + 450;
        }

        var img = "res/res_phz/yzlc/btn_lookChuo.png";
        this.showChuoBtn = new ccui.Button(img);
        UITools.addClickEvent(this.showChuoBtn,this,this.onShowChuo);
        this.showChuoBtn.x = 1750;
        this.showChuoBtn.y = 500;
        this.addChild(this.showChuoBtn,1);
    },

    onShowChuo:function(){
        var cards = {};
        var players = PHZRePlayModel.players;
        for(var i = 0;i < PHZRePlayModel.players.length;++i){
            var direct = PHZRePlayModel.getPlayerSeq(players[i].userId,players[i].seat);
            var layout = this.getLayout(direct);
            var temp = layout.getPlace2Data() || [];
            cards[i] = temp;
        }
        var mc = new YZLCShowChuoPop(players,cards);
        PopupManager.addPopup(mc);
    },

    onHide:function(){
        this.unscheduleUpdate();
    },

    onPlayerInfo:function(obj){
        this._players[obj.temp].playerInfo();
    },

    saveDataByStep:function(step,seat){
        for(var key in this.layouts){
            var layout = this.layouts[key];
            PHZRePlayModel.saveDataByStep(step,key,ArrayUtil.clone(layout.data1),layout.getData2WithCloned(),ArrayUtil.clone(layout.data3));
        }
        PHZRePlayModel.saveLastOutSeatByStep(step,seat);
    },

    refreshAllLayout:function(step){
        if(step<-1){
            step = -1;
        }
        for(var key in this.layouts){
            var data = PHZRePlayModel.getDataByStep(step,key);
            if(data){
                var layout = this.layouts[key];
                layout.refreshByCurData(data.data1,data.data2,data.data3);
            }
        }
        this.lastLetOutSeat = PHZRePlayModel.getLastOutSeatByStep(step);

        for (var key in this._players) {
            var state = PHZRePlayModel.tgState[key][step + 1];
            this._players[key].updateTuoguan(state);
        }
    },

    onLeft: function () {
        this.lastPHZChuPai = 0;
        this.replay.loadTextureNormal("res/res_phz/seePlayBack/playback5.png");
        this.autoPlay = false;
        PHZRePlayModel.step = (this.playedStep-1<0)?0:this.playedStep-1;
        //cc.log("onLeft::"+PHZRePlayModel.step);
        this.playedStep = -1;
        this.refreshAllLayout(PHZRePlayModel.step-1);
        this.playing();
    },

    onRight:function(){
        this.replay.loadTextureNormal("res/res_phz/seePlayBack/playback5.png");
        this.autoPlay = false;
        if(this.playedStep>=(PHZRePlayModel.steps.length-1)){
            return FloatLabelUtil.comText("已经播放到最后一步了");
        }
        if(PHZRePlayModel.step>this.playedStep){
            this.playing();
        }else{
            this.playedStep = -1;
            PHZRePlayModel.ff();
            this.refreshAllLayout(PHZRePlayModel.step-1);
            this.playing();
        }
    },

    onPlay:function(){
        if(this.autoPlay){
            this.autoPlay = false;
            this.replay.loadTextureNormal("res/res_phz/seePlayBack/playback5.png");
        }else{
            this.autoPlay = true;
            this.replay.loadTextureNormal("res/res_phz/seePlayBack/playback3.png");
        }
    },

    onReturnHome:function(){
        for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this._players[i].hideQiHuImg();
            this._players[i].showDaNiaoImg(0);
            this._players[i].hideChuiImg();
            this._players[i].removeWuFuBaojingAni();
            if(this._players[i].Labelzhuang){
                this._players[i].Labelzhuang.removeFromParent(true);
                this._players[i].Labelzhuang = null;
            }
        }
        PopupManager.showPopup(TotalRecordPop);
        if(PopupManager.getClassByPopup(PyqHall)){
            PopupManager.showPopup(PyqHall);
        }
        if(PopupManager.getClassByPopup(GoldClubRecordPop)){
            PopupManager.showPopup(GoldClubRecordPop);
        }
        if(PopupManager.getClassByPopup(GoldRecordPop)){
            PopupManager.showPopup(GoldRecordPop);
        }
        if(PopupManager.getClassByPopup(PyqRecordPop)){
            PopupManager.showPopup(PyqRecordPop);
        }

        var layer = LayerFactory.HOME;
        if(LayerManager.getCurrentLayer() != layer){
            // this.onStop();
            LayerManager.showLayer(layer);
        }


        if(ClubRecallModel.isShowRecord){
            //同步修改
            PopupManager.showPopup(ClubCreditPop);
            ClubRecallModel.isShowRecord = false;
        }
        if(ClubRecallDetailModel.isShowRecord){
            PopupManager.showPopup(ClubHzmjRecallDetailPop);
            ClubRecallDetailModel.isShowRecord = false;
        }
        this.showqihu_step = [];
        this.isShuangLongBuPai = false;
        this.isGetWangpai = false;
    },

    cleanChuPai:function(){
        for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    initData:function(){
        this.Image_64 = this.getWidget("Image_64");
        if(this.Image_64.getChildByName("huifanglabel"))
            this.Image_64.removeChildByName("huifanglabel")
        if(BaseRoomModel.curHfm){
            var label = UICtor.cLabel("回放码:"+BaseRoomModel.curHfm,34,cc.size(500,50),cc.color(255,255,255),0,0);
            this.Image_64.addChild(label);
            label.x = 420;
            label.y = 130;
        }
        this.cleanChuPai();
        //房号
        this.Label_fh.setString("房号："+PHZRePlayModel.tableId);
        this.Label_jushu.setString("第"+PHZRePlayModel.playCount+"局");
        this.Label_progress.setString("进度:0/"+PHZRePlayModel.steps.length);
        this.roomName_label.setString(PHZRePlayModel.roomName);
        this.autoPlay = true;
        this.replay.loadTextureNormal("res/res_phz/seePlayBack/playback3.png");
        this._players = {};
        this.lastPHZChuPai = 0;
        this.dt = this.playIntval - 0.5;
        var players = PHZRePlayModel.players;
        //清除数据
        for(var d=1;d<=players.length;d++){
            var layout = this.layouts[d];
            if(layout){
                layout.clean();
            }
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var isMore = (players.length==4) ? true : false;
            var seq = PHZRePlayModel.getPlayerSeq(p.userId, p.seat);
            this._players[p.seat] = new YZLCRePlayer(p,this.root,seq,isMore);
            if(isMore)
                this._players[p.seat].updateShuXing(p.handCardIds[0]=="");
            this.initCards(seq, p.handCardIds);
        }
        this.playedStep = -1;
        this.lastLetOutSeat = -1;
        this.showqihu_step = [];
        this.isShuangLongBuPai = false;
        this.isGetWangpai = false;
        this.saveDataByStep(-1);
        this.scheduleUpdate();
    },
    //进度更新
    updateProgress:function(){
        this.Label_progress.setString("进度:"+(PHZRePlayModel.step+1)+"/"+PHZRePlayModel.steps.length);
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= this.playIntval){
            this.dt = 0;
            if(this.autoPlay){
                this.playing();
                PHZRePlayModel.ff();
            }
        }
    },

    cleanChuPai:function(){
        for(var i=1;i<=PHZRePlayModel.players.length;i++){
            this.getWidget("cp"+i).removeAllChildren(true);
        }
    },

    playing:function(){
        //playedStep存储的是已经播放过的步骤，当playedStep等于step时，就不再播放当前步骤了
        if(this.playedStep==PHZRePlayModel.step){
            cc.log("step::"+PHZRePlayModel.step+" has played...return playing function...");
            if(this.autoPlay)
                this.dt = this.playIntval;
            return;
        }
        var step = PHZRePlayModel.getCurrentlyStep();
        cc.log("step =",JSON.stringify(step));

        if(step){
            this.updateProgress();
            this.playedStep = PHZRePlayModel.step;
            // cc.log("playing::"+PHZRePlayModel.step+" data::"+JSON.stringify(step));
            var seat = step.seat;
            var action = step.action;
            var ids = step.ids;
            var seq = PHZRePlayModel.getPlayerSeq("",seat);
            var userId = PHZRePlayModel.getPlayerBySeat(seat);
            var actType = (action==9)? 1:2;//1表示摸牌，2表示出牌
            //如果已经显示弃胡，回退后需要隐藏
            if (this.showqihu_step.length>0){
                for (var i = 0; i < this.showqihu_step.length; i++) {
                    if (this.showqihu_step[i][0] > PHZRePlayModel.step){
                        this._players[this.showqihu_step[i][1]].hideQiHuImg();
                        this.showqihu_step.splice(i,1);
                    }
                }
            }

            if(action!=5 && action != 100){
                this.cleanChuPai();
            }
            //表示有人要了那张牌
            if(action!=0&&action!=9&&action!=101){
                this.lastPHZChuPai = 0;
            }
            switch(action){
                case 0://不要
                    soundPrefix = "pass";
                    YZLCRoomEffects.normalAction("pass",this.root,seq,PHZRePlayModel.players.length);
                    PHZRoomSound.yzlcLetOutSound(userId,soundPrefix,true);
                    break;
                case 1://胡
                    YZLCRoomEffects.huPai(this.root,seq,PHZRePlayModel.players.length);
                    var soundPrefix = "hu";
                    PHZRoomSound.yzlcLetOutSound(userId,soundPrefix,true);
                    break;
                case 2://出牌
                case 4://托管出牌
                case 21://刷新戳子
                    //如果点击了回退按钮，就不进入该语句
                    if(ids.length > 0){
                        this.lastLetOutSeat = seat;
                        var cardTransData = [];
                        for(var i=0;i<ids.length;i++){
                            cardTransData.push(PHZAI.getPHZDef(ids[i]));
                        }

                        var soundPrefix = PHZAI.findCardType(cardTransData);
                        var self = this;
                        if(soundPrefix != ""){
                            PHZRoomSound.yzlcLetOutSound(userId,soundPrefix,cardTransData.length !== 1);
                        }

                        var layout = self.getLayout(seq);
                        if(action !== 21) {
                            for(var i = 0;i < cardTransData.length;++i){
                                layout.chuPai(cardTransData[i]);
                            }
                            YZLCRoomEffects.chuPai(this.getWidget("cp"+seq),cardTransData,actType,PHZRePlayModel.players.length,seq,
                                self.getWidget("oPanel"+seq)
                            );
                        }else{/** 21是戳子 **/
                            layout.chiPai(ids,action,ids.length);
                        }
                    }
                    break;
                case 100://刷新托管状态
                    this._players[seat].updateTuoguan(ids[0]);
                    break;
            }

            // this.lastAction = action;
            //更新胡息
            for(var i=1;i<=PHZRePlayModel.players.length;i++){
                var seq = PHZRePlayModel.getPlayerSeq("",i);//将玩家的座位号转换为玩家序号
                this._players[i].updateHuXi(this.getLayout(seq).totalHuXi);
            }
            this.saveDataByStep(PHZRePlayModel.step,this.lastLetOutSeat);
            //判断是否胡牌
            if(PHZRePlayModel.step == (PHZRePlayModel.steps.length-1)){
                var soundPrefix = (this.lastLetOutSeat==seat || PHZRoomModel.remain==19) ? "hu" : "hu";
                PHZRoomSound.actionSound(userId,soundPrefix);
                this.showqihu_step = [];
                this.isShuangLongBuPai = false;
                this.isGetWangpai = false;
                var self = this;
                setTimeout(function(){
                    for(var i=1;i<=PHZRePlayModel.players.length;i++){
                        self._players[i].hideQiHuImg();
                        self._players[i].showDaNiaoImg(0);
                        self._players[i].hideChuiImg();
                        self._players[i].removeWuFuBaojingAni();
                        if(self._players[i].Labelzhuang){
                            self._players[i].Labelzhuang.removeFromParent(true);
                            self._players[i].Labelzhuang = null;
                        }
                    }
                    var mc = new YZLCSmallResultPop(PHZRePlayModel.closingData,true);
                    PopupManager.addPopup(mc);
                },1800);
            }
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout){
            return layout;
        }
        layout = new YZLCRePlayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,P1Mahjong){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct));
        layout.refresh(P1Mahjong,[],[]);
    }

})