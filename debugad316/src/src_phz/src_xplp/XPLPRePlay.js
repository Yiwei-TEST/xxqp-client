/**
 * Created by Administrator on 2020/6/3.
 */

var XPLPReplay = BaseLayer.extend({

    playIntval:1.2,
    _isJuflag:false,

    ctor:function(json){
        this.layouts = {};
        this._isJuflag = false;
        this._super(json);
    },

    selfRender:function(){
        this.Label_10 = this.getWidget("Label_10");
        this.Panel_20 = this.getWidget("Panel_20");
        this.Label_progress = this.getWidget("Label_progress");
        this.BitmapLabel_speed = this.getWidget("BitmapLabel_speed");
        this.Label_mj = this.getWidget("Label_mj");
        this.Label_mj.visible = false;
        this.replay_l = this.getWidget("replay_l");
        UITools.addClickEvent(this.replay_l,this,this.onLeft);
        this.replay = this.getWidget("replay");
        this.replay.loadTextureNormal("res/res_mj/mjReplay/playback3.png");
        UITools.addClickEvent(this.replay,this,this.onPlay);
        this.replay_r = this.getWidget("replay_r");
        UITools.addClickEvent(this.replay_r,this,this.onRight);
        this.btn_exit = this.getWidget("btn_exit");
        UITools.addClickEvent(this.btn_exit,this,this.onReturnHome);
        this.Button_speed = this.getWidget("Button_speed");
        UITools.addClickEvent(this.Button_speed,this,this.onSpeed);

        this.roomName_label = new cc.LabelTTF(XPLPReplayModel.roomName,"Arial",32,cc.size(135, 60));
        this.Label_10.addChild(this.roomName_label, 10);
        this.roomName_label.setAnchorPoint(0,1);
        this.roomName_label.setString(XPLPReplayModel.roomName);
        this.roomName_label.setColor(cc.color(255,255,255));
        this.roomName_label.x = 0;
        this.roomName_label.y = -40;

        if(XPLPReplayModel.renshu == 4){
            this.getWidget("mPanel"+4).y += 180;
            this.getWidget("mPanel"+2).x += 50;
            this.getWidget("mPanel"+2).y += 60;
            this.getWidget("mPanel"+3).y -= 10;

            this.getWidget("oPanel"+1).x -= 100;
            this.getWidget("oPanel"+1).y += 120;
            this.getWidget("oPanel"+4).x -= 20;
            this.getWidget("oPanel"+2).x += 5;
            this.getWidget("oPanel"+2).y += 60;
            this.getWidget("oPanel"+4).y += 60;
            this.getWidget("oPanel"+3).y += 180;
            this.getWidget("oPanel"+3).x -= 420;
        }else if(XPLPReplayModel.renshu == 3){
            this.getWidget("mPanel"+3).y += 220;
            this.getWidget("mPanel"+2).x += 50;
            this.getWidget("oPanel"+2).y += 220;
            this.getWidget("oPanel"+3).y += 220;
            this.getWidget("oPanel"+1).x -= 340;
        }else if(XPLPReplayModel.renshu == 2){
            this.getWidget("oPanel"+2).x -= 1275;
            this.getWidget("oPanel"+1).x -= 325;
        }

        cc.spriteFrameCache.addSpriteFrames(res.xplp_cards_plist);
    },



    onSpeed: function() {
        if (this.playIntval == 1.2) {
            this.playIntval = 0.6;
            this.BitmapLabel_speed.setString("x2");
        } else if(this.playIntval == 0.6) {
            this.playIntval = 0.35;
            this.BitmapLabel_speed.setString("x4");
        } else if(this.playIntval == 0.35) {
            this.playIntval = 1.2;
            this.BitmapLabel_speed.setString("x1");
        }
    },


    onHide:function(){
        this.unscheduleUpdate();
    },

    onPlayerInfo:function(obj){
        this._players[obj.temp].showInfo();
    },

    onLeft:function(){
        this.replay.loadTextureNormal("res/res_mj/mjReplay/playback5.png");
        this.autoPlay = false;
        XPLPReplayModel.step = (this.playedStep-1<0) ? 0 : this.playedStep-1;
        this.playedStep = -1;
        //XPLPReplayModel.rew();
        this.refreshAllLayout((XPLPReplayModel.step-1));
        this.playing();
    },

    onPlay:function(){
        if(this.autoPlay){
            this.autoPlay = false;
            this.replay.loadTextureNormal("res/res_mj/mjReplay/playback5.png");
        }else{
            this.replay.loadTextureNormal("res/res_mj/mjReplay/playback3.png");
            this.dt = this.playIntval;
            this.autoPlay = true;
        }
    },

    onRight:function(){
        this.replay.loadTextureNormal("res/res_mj/mjReplay/playback5.png");
        this.autoPlay = false;
        if(this.playedStep>=(XPLPReplayModel.steps.length-1))
            return FloatLabelUtil.comText("已经播放到最后一步");
        if(XPLPReplayModel.step>this.playedStep){
            this.playing();
        }else{
            this.playedStep=-1;
            XPLPReplayModel.ff();
            this.refreshAllLayout((XPLPReplayModel.step-1));
            this.playing();
        }
    },

    onReturnHome:function(){


        PopupManager.showPopup(TotalRecordPop);
        if(PopupManager.getClassByPopup(PyqHall)){
            PopupManager.showPopup(PyqHall);
        }

        var layer = LayerFactory.HOME;
        LayerManager.showLayer(layer);
        if(ClubRecallModel.isShowRecord){
            PopupManager.showPopup(PyqHall);
            //同步修改
            PopupManager.showPopup(ClubCreditPop);
            ClubRecallModel.isShowRecord = false;
        }
        if(ClubRecallDetailModel.isShowRecord){
            PopupManager.showPopup(ClubHzmjRecallDetailPop);
            ClubRecallDetailModel.isShowRecord = false;
        }

    },

    initData:function(flag){
        XPLPReplayModel.guchouSeat = -1;
        this._isJuflag = flag;
        this.Label_10.setString("房号:"+XPLPReplayModel.tableId);

        var jushstr = ("第" + XPLPReplayModel.nowBurCount + "/" + XPLPReplayModel.totalBurCount + "局");
        if(!this.label_jushu){
            this.label_jushu = new cc.LabelTTF("","Arial",24);
            this.label_jushu.setAnchorPoint(0,0.5);
            this.label_jushu.setPosition(0,-20);
            this.Label_10.addChild(this.label_jushu);
        }
        if(XPLPReplayModel.replayId != ""){
            if(!this.label_replayId){
                this.label_replayId = new cc.LabelTTF("","Arial",36);
                this.label_replayId.setAnchorPoint(1,1);
                this.label_replayId.setPosition(1890,1050);
                this.Panel_20.addChild(this.label_replayId);
            }
            this.label_replayId.setString(XPLPReplayModel.replayId);
        }
        this.label_jushu.setString(jushstr);
        
        this.roomName_label.setString(XPLPReplayModel.roomName);
        this.autoPlay = true;
        this.replay.loadTextureNormal("res/res_mj/mjReplay/playback3.png");
        this._players = {};
        this.dt = this.playIntval-0.5;
        var players = XPLPReplayModel.players;
        var resultPlayers = XPLPReplayModel.closingMsg.closingPlayers;
        for(var d=1;d<=4;d++){
            var layout = this.layouts[d];
            if(layout)//清理掉上一次的牌局数据
                layout.clean();
        }
        for(var i=0;i<players.length;i++){
            var p = players[i];
            var seq = XPLPReplayModel.getPlayerSeq(p.userId,XPLPReplayModel.mySeat, p.seat);
            this._players[p.seat] = new XPLPReplayer(p,this.root,seq);
            this.initCards(seq,p.handCardIds, p.seat);
            this._players[p.seat].showDianNum(resultPlayers[i].birdPoint);
        }

        this.hideButton();
        this.playedStep = -1;
        this.lastLetOutSeat = -1;
        this.lastMoSeat = -1;
        this.tingStep = 0;
        this.tingSeat = 0;
        this.cleanBaoPai();
        this.BaoDisplay();
        this.Label_progress.setString("0-"+XPLPReplayModel.steps.length);
        this.playIntval=1.2;
        this.BitmapLabel_speed.setString("x1");
        this.saveDataByStep(-1);
        this.scheduleUpdate();
    },

    cleanBaoPai:function(){
        XPLPRoomModel.seeBaoPai(0);
        //this.onShowBaoPai();
        if(this.root.getChildByTag(XPLPRoomEffects.BAO_TAG)) {
            this.removeChildByTag(XPLPRoomEffects.BAO_TAG);
        }

    },

    BaoDisplay:function(){
        //XPLPReplayModel.getBaoPaiId();
        //if(XPLPReplayModel.baoPaiId>0){
        //    XPLPRoomModel.seeBaoPai(XPLPReplayModel.baoPaiId);
        //    this.onShowBaoPai();
        //    XPLPRoomEffects.addBaoPaiDisplay(this.root,730,350);
        //}
    },

    updateProgress:function(){
        this.Label_progress.setString(""+(XPLPReplayModel.step+1)+"-"+XPLPReplayModel.steps.length);
    },

    saveDataByStep:function(step,seat){
        for(var key in this.layouts){
            var layout = this.layouts[key];
            XPLPReplayModel.saveDataByStep(step,key,ArrayUtil.clone(layout.data1),layout.getData2WithClone(layout.data2),ArrayUtil.clone(layout.data3));
        }
        XPLPReplayModel.saveLastOutSeatByStep(step,seat);
    },

    refreshAllLayout:function(step){
        if(step<-1)
            step = -1;
        for(var key in this.layouts){
            var data = XPLPReplayModel.getDataByStep(step,key);
            if(data){
                var layout = this.layouts[key];
                layout.refreshByCurData(data.data1,data.data2,data.data3);
            }
        }
        this.lastLetOutSeat = XPLPReplayModel.getLastOutSeatByStep(step);

        for (var key in this._players) {
            var state = XPLPReplayModel.tgState[key][step + 1];
            this._players[key].updateTuoguan(state);
        }
    },

    hideFinger:function(){
        for(var key in this.layouts){
            this.layouts[key].hideFinger();
        }
    },

    showJianTou:function(seat){
        //this.jt.visible = true;
        //seat = seat || XPLPReplayModel.getNextSeat();
        //for(var i=1;i<=4;i++){
        //    this.getWidget("jt"+i).visible = false;
        //}
        //if(seat != -1){
        //    var direct = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat, seat);
        //    //cc.log("showJianTou::"+direct);
        //    this.getWidget("jt"+direct).visible = true;
        //}
    },

    playing:function(){
        if(this.playedStep==XPLPReplayModel.step){
            if(this.autoPlay)
                this.dt = this.playIntval;
            return;
        }
        var step = XPLPReplayModel.getCurrentlyStep();
        if(step){
            this.updateProgress();
            this.showJianTou();
            this.playedStep = XPLPReplayModel.step;
            var seat = step.seat;
            var action = step.action;
            var ids = step.ids;
            var seq = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat, seat);
            var userId = XPLPReplayModel.getPlayerBySeat(seat);
            //if(this.playedStep<this.tingStep){
            //    this._players[this.tingSeat].tingPai(false);
            //}

            //this.hideButton();

            //if(XPLPReplayModel.step == 0) {//桃江麻将刷新按钮
            //    for(var j=0;j<XPLPReplayModel.players.length;j++){
            //        var p = XPLPReplayModel.players[j];
            //        if(p){
            //            this.showButton(p.seat,false);
            //        }
            //    }
            //}

            switch (action){
                case 0://出牌
                    this.hideFinger();
                    this.getLayout(seq).chuPai(XPLPAI.getMJDef(ids[0]));
                    this.lastLetOutSeat = seat;
                    XPLPRoomSound.letOutSound(userId,XPLPAI.getMJDef(ids[0]));

                    //this.showButton(seat,false);
                    break;
                case 14://箍臭
                    XPLPReplayModel.guchouSeat = seat;
                    break;
                case 21://听牌
                    this._players[seat].tingPai(true);
                    this.tingStep = this.playedStep;
                    this.tingSeat = seat;
                    XPLPRoomEffects.normalAction(this.root,"ting",this.getWidget("cp"+seq),userId);
                    break;
                case 22://别人有操作时的补蛋
                    this.lastLetOutSeat = seat;
                    var nextstep = XPLPReplayModel.getNextStep();//取出下一步的数据
                    if(nextstep.action != 5){//如果别人可以碰，并且碰了
                        var lastOutseq = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat,this.lastLetOutSeat);
                        this.getLayout(lastOutseq).chuPai(XPLPAI.getMJDef(ids[0]));
                    }
                    break;
                case 1://胡牌
                    var isZiMo = (this.lastMoSeat==seat);
                    var prefix = isZiMo ? "zimo" : "hu";
                    XPLPRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+seq),userId);
                    XPLPRoomSound.actionSound(userId,prefix);
                    var fromXPLPRoomModel = ids[0];
                    if(!isZiMo && this.lastLetOutSeat>0 && ids.length > 0){
                        var lastseq = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat, this.lastLetOutSeat);
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length-1];
                            if(fromData.c==fromXPLPRoomModel){
                                this.hideFinger();
                                layout.beiPengPai(fromXPLPRoomModel);
                            }
                        }
                    }
                    var huXPLPRoomModelVo = this.getLayout(seq).huPai(isZiMo,this.lastLetOutSeat,fromXPLPRoomModel);
                    if (huXPLPRoomModelVo) {
                        var huRecord = XPLPReplayModel.getHuRecordById(seat,huXPLPRoomModelVo.c);
                        if (huRecord) {
                            var score = huRecord.ext[3];
                            var paoSeat = huRecord.ext[1];
                            if (huRecord.ext[1] > 0) {
                                this._players[seat].changeSPoint(score);
                                this._players[paoSeat].changeSPoint(-score);
                            } else {
                                this._players[seat].changeSPoint(score*3);
                                for (var key in this._players) {
                                    if (key != seat) {
                                        this._players[key].changeSPoint(-score);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 2://碰
                case 3://明杠
                case 4://暗杠
                case 6://吃
                case 7://补张(长沙麻将需要fromSeat)
                case 20://下蛋
                    var prefix = "peng";
                    if(action==7){
                        prefix = "bu";
                    }else if(action==6){
                        prefix = "chi";
                    }else if(action==3 || action==4){
                        prefix = "gang";
                    }else if(action==20){
                        prefix = "xiadan";
                    }

                    var fromXPLPRoomModel = (action==6) ? ids[1] : ids[ids.length-1];
                    this.getLayout(seq).pengPai(ids,action);
                    if(this.lastLetOutSeat>0){
                        var lastseq = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat, this.lastLetOutSeat);
                        var layout = this.getLayout(lastseq);
                        var fromData = layout.data3;
                        if(fromData.length>0){
                            fromData = fromData[fromData.length-1];
                            if(fromData.c==fromXPLPRoomModel){
                                this.hideFinger();
                                layout.beiPengPai(fromXPLPRoomModel);
                            }
                        }
                    }
                    XPLPRoomEffects.normalAction(this.root,prefix,this.getWidget("cp"+seq),userId);
                    XPLPRoomSound.actionSound(userId,prefix);
                    break;
                case 5://过
                    XPLPRoomEffects.normalAction(this.root,"guo",this.getWidget("cp"+seq),userId);
                    break;
                case 8://小胡
                    this.getLayout(seq).xiaohu(ids);
                    XPLPRoomEffects.normalAction(this.root,"btn_cs_xiaohu_"+step.type,this.getWidget("cp"+seq),userId);
                    break;
                case 9://摸牌
                    this.lastMoSeat = seat;
                    this.getLayout(seq).moPai(ids[0]);

                    //this.showButton(seat,true);
                    break;
                case 11://长沙麻将杠
                    this.hideFinger();
                    this.getLayout(seq).chuPai(XPLPAI.getMJDef(ids[0]));
                    if(ids.length>1)
                        this.getLayout(seq).chuPai(XPLPAI.getMJDef(ids[1]));
                    this.lastLetOutSeat = seat;
                    break;
                case 100://刷新托管状态
                    this._players[seat].updateTuoguan(ids[0]);
                    break;
            }
            this.saveDataByStep(XPLPReplayModel.step,this.lastLetOutSeat);
            if(XPLPReplayModel.step==(XPLPReplayModel.steps.length-1)){
                var mc = new XPLPSmallResultPop(XPLPReplayModel.closingMsg,true);
                PopupManager.addPopup(mc);
            }
        }
    },

    showButton:function(localSeat,isMopai){
        localSeat = localSeat || 0;
        var step = XPLPReplayModel.getNewCurrentlyStep(isMopai);
        //cc.log(" 当前找到的操作列表 step = ",JSON.stringify(step));
        if(step && step.length > 0) {
            for(var i = 0;i < step.length;++i){
                var seat = step[i].seat;
                var seq = XPLPReplayModel.getPlayerSeq("",XPLPReplayModel.mySeat, seat);//转化后的座位号
                var action = step[i].action;
                var ids = step[i].ids;
                if((localSeat == seat && !isMopai) || (isMopai && localSeat != seat)){
                    //FloatLabelUtil.comText("位置不对不显示！！！");
                    return;
                }
                var tempArr = [];
                if(action == 12){//只有12才显示按钮
                    tempArr = ids;
                }
                this.refreshButton(seq,tempArr);
            }
        }
    },

    hideButton:function(){
        if(this.tjmjButtonNode){
            this.tjmjButtonNode.removeAllChildren();
            this.tjmjButtonNode.visible = false;
        }
    },

    refreshButton:function(seatId,actArray){
        actArray = actArray || [];
        var textureMap = {
            0:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_hu.png",v:1},
            1:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_peng.png",v:2},
            2:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_gang.png",v:3},
            3:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_gang.png",v:4},
            4:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_chi.png",v:6},
            5:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_hu.png",v:1},
            7:{t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_ting.png",v:21}
        };

        var buttonList = [];
        for(var i = 0;i < actArray.length;++i){
            if(actArray[i] == 1){
                buttonList.push(textureMap[i]);
            }
        }

        if(buttonList.length === 0 && actArray.length !== 23){
            if(this.tjmjButtonNode){
                this.tjmjButtonNode.visible = false;
            }
            return;
        }

        buttonList.push({t:"res/res_mj/res_bsmj/bsmjRoom/mj_btn_guo.png",v:5});

        if(!this.tjmjButtonNode) {
            this.tjmjButtonNode = new cc.Node();
            this.tjmjButtonNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            this.addChild(this.tjmjButtonNode);
        }
        this.tjmjButtonNode.visible = true;

        var scale = 0.8;
        if(seatId != 1){
            scale = 0.5;
        }
        var localPosX = 0;
        var localPosY = 0;
        var offPosX = 0;
        var offPosY = 0;
        if(seatId == 1){
            localPosX = 250;
            offPosX = -200;
            localPosY = -270;
        }else if(seatId == 2){
            if(XPLPReplayModel.renshu == 2){
                localPosX = 250;
                offPosX = -200;
                localPosY = 270;
            }else{
                localPosX = 550;
                offPosY = -180;
                localPosY = 200;
            }
        }else if(seatId == 3){
            if(XPLPReplayModel.renshu == 2){
                localPosX = 550;
                offPosX = -200;
                localPosY = 270;
            }else if(XPLPReplayModel.renshu == 3){
                localPosX = -550;
                localPosY = 200;
                offPosY = -180;
            }else{
                localPosX = 250;
                offPosX = -200;
                localPosY = 270;
            }
        }else if(seatId == 4){
            localPosX = -550;
            localPosY = 200;
            offPosY = -180;
        }
        for(var i = 0;i < buttonList.length;++i){
            if(buttonList[i]){
                var buttonSp = new cc.Sprite(buttonList[i].t);
                buttonSp.scale = scale;
                buttonSp.x = localPosX + offPosX * i;
                buttonSp.y = localPosY + offPosY * i;
                this.tjmjButtonNode.addChild(buttonSp);
                cc.log(" AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ",i);
            }
        }
    },

    update:function(dt){
        this.dt+=dt;
        if(this.dt>=this.playIntval){
            this.dt=0;
            if(this.autoPlay && !XPLPReplayModel.isFinish()){
                this.playing();
                XPLPReplayModel.ff();
            }
        }
    },

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout)
            return layout;
        layout = new XPLPReplayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,p1Mahjongs,seat){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct),this.getWidget("hPanel"+direct),seat);
        layout.refresh(p1Mahjongs,[],[],[]);
    },
});