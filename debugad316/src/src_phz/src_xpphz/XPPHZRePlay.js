/**
 * Created by Administrator on 2016/12/16.
 */
var XPPHZRePlayer = cc.Class.extend({
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
        PHZRoomModel.banker = vo.seat;
        this.updatePoint(vo.point);
        if(isMore){
        	this.sx = ccui.helper.seekWidgetByName(root,"sx"+seq);
        	this.sx.visible = false;
        }

        this.tuoguanSp = ccui.helper.seekWidgetByName(this.iconbg, "tuoguanSp");
        if (this.tuoguanSp){
            this.tuoguanSp.visible = false;
        }
    },

    updateTuoguan:function(isTuoguan){
        if(this.tuoguanSp){
            this.tuoguanSp.visible = isTuoguan == 1;
        }
    },

    updateHuXi:function(huxi) {
    	this.hx.setString(huxi+"胡息");
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
        var defaultimg = "res/ui/common/default_m.png";
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
                clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: 65, y: 65, alphaThreshold: 0.8});
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
            sprite.x = 65;
            sprite.y = 65;
            this.iconbg.addChild(sprite,5,345);
        }
    }
});



var XPPHZReplay = BaseLayer.extend({
    playIntval:1.5,//自动播放速度
    ctor:function(json){
        this.layouts = {};
        this.btnNode = {};
        this._super(json);
    },
    selfRender:function(){
        for(var i=1;i<4;i++){
            this.player = this.getWidget("player"+i);
            UITools.addClickEvent(this.player,this,this.onPlayerInfo);
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
            this.roomName_label = new cc.LabelTTF(PHZRePlayModel.roomName,"Arial",36,cc.size(500, 40));
            this.addChild(this.roomName_label, 10);
            this.roomName_label.setName("roomName_label");
            this.roomName_label.setColor(cc.color(255,255,255));
            this.roomName_label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this.roomName_label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.roomName_label.x = cc.winSize.width/2;
            this.roomName_label.y = cc.winSize.height/2 + 450;
        }
    },

    //显示操作按钮
    showOptBtn:function(seq,act){
        var textureMap = {
            0:{t:"res/res_phz/act_button/hu.png",v:1},
            1:{t:"res/res_phz/act_button/peng.png",v:2},
            2:{t:"res/res_phz/act_button/wai.png",v:3},
            3:{t:"res/res_phz/act_button/liu.png",v:4},
            4:{t:"res/res_phz/act_button/chi.png",v:6},
            5:{t:"res/res_phz/act_button/pao.png",v:7}
        };

        this.removeOptBtn(seq);

        this.btnNode[seq] = new cc.Node();
        var pos = cc.p(cc.winSize.width/2,cc.winSize.height/3);

        var renshu = PHZRePlayModel.players.length;
        if(renshu == 2){
            if(seq == 2){
                pos.y += cc.winSize.height/3;
                pos.x += cc.winSize.width/4;
            }
        }else if(renshu == 3){
            if(seq == 2){
                pos.y += cc.winSize.height/3;
                pos.x += cc.winSize.width/4;
            }
            if(seq == 3){
                pos.y += cc.winSize.height/3;
                pos.x -= cc.winSize.width/4;
            }
        }


        this.btnNode[seq].setPosition(pos);
        this.addChild(this.btnNode[seq]);

        var btnDatas = [];
        var isShowBtn = true;
        for(var i=0;i<act.length;i++){
            var temp = act[i];
            var tm = textureMap[i];
            if(temp == 1 && (i==2 || i==3 || i==6 || i == 5)){
                isShowBtn = false;
            }

            if (tm && temp == 1) {
                btnDatas.push(tm);
            }
        }
        if(btnDatas.length > 0){
            btnDatas.push({t:"res/res_phz/act_button/guo.png",v:5});
        }

        if(btnDatas.length>0 && isShowBtn){
            var offsetX = 100;
            var startX = -(btnDatas.length - 1)/2*offsetX;
            for(var i=0;i<btnDatas.length;i++){
                var btnData = btnDatas[i];
                var btn = new ccui.Button(btnData.t,btnData.t,"");
                btn.setPosition(startX + offsetX*i,0);
                btn.setScale(0.5);
                this.btnNode[seq].addChild(btn);
            }
        }

    },

    removeOptBtn:function(seq){
        if(this.btnNode[seq]){
            this.btnNode[seq].removeFromParent(true);
        }
        this.btnNode[seq] = null;
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
            label.setName("huifanglabel")
        }
        PHZRoomModel.banker = 0;
        this.cleanChuPai();
        //房号
        this.Label_fh.setString("房号："+PHZRePlayModel.tableId);
        this.Label_jushu.setString("第"+PHZRePlayModel.playCount+"局");
        this.Label_progress.setString("进度:0/"+PHZRePlayModel.steps.length);
        this.roomName_label.setString(PHZRePlayModel.roomName);
        this.autoPlay = true;
        this.replay.loadTextureNormal("res/res_phz/phzReplay/playback3.png");
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
        	this._players[p.seat] = new PHZRePlayer(p,this.root,seq,isMore);
        	if(isMore)
        		this._players[p.seat].updateShuXing(p.handCardIds[0]=="");
        	this.initCards(seq, p.handCardIds);

            var act = PHZRePlayModel.getCurSeatAct(p.seat,true);
            if(act){
                this.showOptBtn(seq,act);
            }

        }
        this.playedStep = -1;
        this.lastLetOutSeat = -1;
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

            if(action != 100)this.removeOptBtn(seq);
            var players = PHZRePlayModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var act = PHZRePlayModel.getCurSeatAct(p.seat);
                var curSeq = PHZRePlayModel.getPlayerSeq("", p.seat);
                if(act){
                    this.showOptBtn(curSeq,act);
                }else if(action != 101 && action != 100){
                    this.removeOptBtn(curSeq);
                }
            }

            if(this.baojingStep && this.playedStep<this.baojingStep){
                for(var i=1;i<=PHZRePlayModel.players.length;i++){
                    this._players[i].removeWuFuBaojingAni();
                }
            }
            if(action!=5 && action != 100){
                this.cleanChuPai();
            }
            //表示有人要了那张牌
            if(action!=0&&action!=9&&action!=101 && action != 100){
                this.lastPHZChuPai = 0;
            }
            switch(action){
                case 0://出牌
                case 9://摸牌
                    //如果点击了回退按钮，就不进入该语句
                    // cc.log("this.lastPHZChuPai =",this.lastPHZChuPai,"this.lastLetOutSeat =",this.lastLetOutSeat);
                    if((this.lastPHZChuPai > 0 && this.lastLetOutSeat>0)){//这里有牌缓存了
                        var chuPaiSeq = PHZRePlayModel.getPlayerSeq("",this.lastLetOutSeat);
                        this.getLayout(chuPaiSeq).chuPai(PHZAI.getPHZDef(this.lastPHZChuPai));
                    }
                    this.lastLetOutSeat = seat;
                    if(actType==1){
                        this.lastPHZChuPai = ids[0];
                    }else{
                        this.getLayout(seq).chuPai(PHZAI.getPHZDef(ids[0]));
                    }
                    XPPHZRoomEffects.chuPai(this.getWidget("cp"+seq),PHZAI.getPHZDef(ids[0]),actType,PHZRePlayModel.players.length,seq);

                    PHZRoomSound.letOutSound(userId,PHZAI.getPHZDef(ids[0]));
                    break;
                case 15://补牌
                    var layout = this.getLayout(seq);
                    var data1 = layout.transData(ArrayUtil.clone(layout.handcardsid1));
                    layout.refreshP1(data1);
                    break;
                case 1://胡
                	XPPHZRoomEffects.huPai(this.root,seq,PHZRePlayModel.players.length);
                    PHZRoomSound.actionSound(userId,"hu");
                    break;
                case 101://过
                    XPPHZRoomEffects.normalAction("guo",this.root,seq,PHZRePlayModel.players.length);
                    break;
                case 2://碰
                case 4://提
                case 11:
                case 18:
                case 3://偎
                case 6://吃
                case 7://跑
                case 10://臭偎
                    var fromPHZ = ids[0];
                    this.getLayout(seq).chiPai(ids,action);
                    if(this.lastLetOutSeat>0){
                        var lastseq = PHZRePlayModel.getPlayerSeq("",this.lastLetOutSeat)
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length - 1];
                            if(fromData.c == fromPHZ){
                                layout.beiPengPai(fromPHZ);
                            }
                        }
                    }
                    var prefixMap = {2:"peng",3:"wei",4:"ti",6:"chi",7:"pao",10:"chouwei"};

                    var prefix = prefixMap[action];
                    if(prefix){
                    	XPPHZRoomEffects.normalAction(prefix,this.root,seq,PHZRePlayModel.players.length);
                    }
                    PHZRoomSound.actionSound(userId,prefix);
                    break;
                case 100://刷新托管状态
                    this._players[seat].updateTuoguan(ids[0]);
                    break;
                case 108:
                    this._players[seat].daniao_score.setString(ids[0]);
                    break;
                case 109:
                    var string = "庄";
                    if (ids[0] > 1){
                        if(ClosingInfoModel.intParams[6] == 2){
                            string = "中庄";
                        }else if(ClosingInfoModel.intParams[6] == 3){
                            string = "庄";
                        }else{
                            string = "庄"+ids[0];
                        }
                    }
                    this._players[seat].Labelzhuang.setString(string);
                    PHZRoomModel.banker = seat;
                    break;
                case 110:
                    this._players[seat].showWuFuBaojingAni();
                    this.baojingStep = this.playedStep;
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
                var self = this;
                setTimeout(function(){
                    var mc ;
                    mc = new XPPHZSmallResultPop(PHZRePlayModel.closingData,true);
                    PopupManager.addPopup(mc);
                },1800);
            }
        }
    },

    isForceRemove:function(){
        return true;
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout){
            return layout;
        }
        layout = new XPPHZRePlayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,P1Mahjong){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct));
        layout.refresh(P1Mahjong,[],[]);
    }

})