/**
 * Created by Administrator on 2016/12/16.
 */

var PHZRePlayer = cc.Class.extend({
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
        if(PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH){
            this.zj.loadTexture("res/res_phz/zzph/di.png")
            zhuang_cardNum = 14;
            this.zj.scale = 0.6;
        }
        this.zj.visible = false;
        this.huxi = 0;
        this.totalHuXi = 0;
        // this.lastAction = -1;
        this.hx = ccui.helper.seekWidgetByName(root,"hx"+seq);
        this.updateHuXi(0);
        this.showIcon();

        this.isBanker((vo.handCardIds.length>zhuang_cardNum));
        PHZRoomModel.banker = vo.seat;
        if (PHZRePlayModel.playType == GameTypeEunmZP.LDFPF){
            this.updatePoint(vo.allHuxi);
        }else{
            this.updatePoint(vo.point);
        }
        if(isMore){
            this.sx = ccui.helper.seekWidgetByName(root,"sx"+seq);
            this.sx.visible = false;
        }

        var label = this.iconbg.getChildByName("label_credit");
        if(cc.isNumber(vo.credit)){
            if(!label){
                label = new cc.LabelTTF("","Arial",30);
                label.setColor(cc.color(255,165,0));
                label.setPosition(this.iconbg.width/2,-55);
                label.setName("label_credit");
                this.iconbg.addChild(label,1);
            }
            label.setString("赛:" + MathUtil.toDecimal(vo.credit/100));
        }else{
            label && label.setString("");
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
            if(PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH){
                this.daniao_score.visible = true;
            }
        // }

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

    showPiaoImg:function(type){
        var pngUrl ="res/res_phz/biao_piao"+type+".png";
        this.chuiImg.setTexture(pngUrl);
        this.chuiImg.visible =true;
        this.chuiImg.x = 100
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
        if(PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH){
            this.Labelzhuang = new cc.LabelBMFont("庄", "res/res_phz/zzph/zhaungnum.fnt");
            this.Labelzhuang.setPosition(60,75);
            // this.Labelzhuang.setScale(0.8,0.7);
            this.zj.addChild(this.Labelzhuang);
        }
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



var PHZReplay = BaseLayer.extend({
    playIntval:1.5,//自动播放速度
    ctor:function(json){
        this.layouts = {};
        this.btnNode = {};
        this._super(json);

        //落地扫替换下王牌的资源
        if(PHZRoomModel.wanfa != GameTypeEunmZP.ZHZ && PHZRoomModel.wanfa != GameTypeEunmZP.GLZP){
            var replaceFrameArr = ["big_cards1_11b.png","big_cards3_11b.png",
                "cards_listencard_81b.png","phz_cphua.png","small_cards1_11b.png","small_cards3_11b.png"];
            for (var i = 0; i < replaceFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(replaceFrameArr[i]);
                var frame = new cc.Sprite("res/res_phz/ldswp/" + replaceFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, replaceFrameArr[i]);
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
            //桂林字牌替换牌底的资源
            var cardsFrameArr = ["big_face_1.png","big_face1.png","big_face2.png",
                "big_face3.png","big_face4.png","big_half_face_1.png",
                "big_half_face_2.png","big_half_face_3.png","big_half_face_4.png",
                "big_half_face1_1.png","big_half_face1_2.png","big_half_face1_3.png",
                "big_half_face1_4.png","big_half_face2_1.png","big_half_face2_2.png",
                "big_half_face2_3.png","big_half_face2_4.png","small_half_back.png",
                "small_half_face_1.png","small_half_face_2.png","small_half_face_3.png",
                "small_half_face_4.png","small_half_face1_1.png","small_half_face1_2.png",
                "small_half_face1_3.png","small_half_face1_4.png","small_half_face2_1.png",
                "small_half_face2_2.png","small_half_face2_3.png","small_half_face2_4.png"
            ];
            for (var i = 0; i < cardsFrameArr.length; ++i) {
                cc.spriteFrameCache.removeSpriteFrameByName(cardsFrameArr[i]);
                var frame = new cc.Sprite("res/res_phz/glzpCard/" + cardsFrameArr[i]).getSpriteFrame();
                cc.spriteFrameCache.addSpriteFrame(frame, cardsFrameArr[i]);
            }
        }else{
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.phz_plist);
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.phz_cards_plist);
            cc.spriteFrameCache.addSpriteFrames(res.phz_plist);
            cc.spriteFrameCache.addSpriteFrames(res.phz_cards_plist);
        }
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
        // BaseRoomModel.curHfm
        
        
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

        if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
            textureMap[7] = {t:"res/res_phz/wangdiao.png",v:15};
            textureMap[8] = {t:"res/res_phz/wangchuang.png",v:16};
            textureMap[9] = {t:"res/res_phz/wangzha.png",v:19};
            textureMap[10] = {t:"res/res_phz/wangzha.png",v:20};
            textureMap[11] = {t:"res/res_phz/wangchuang.png",v:18};
            textureMap[12] = {t:"res/res_phz/wangdiao.png",v:17};
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
            textureMap[3] = {t:"res/res_phz/axwmq/btn_zhe_1.png",v:4};
        }

        this.removeOptBtn(seq);

        this.btnNode[seq] = new cc.Node();
        var pos = cc.p(cc.winSize.width/2,cc.winSize.height/3);

        var renshu = PHZRePlayModel.players.length;
        if(renshu == 2){
            if(seq == 2){
                pos.y += cc.winSize.height/3;
                pos.x -= cc.winSize.width/4;
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
        }else if(renshu == 4){
            if(seq == 2){
                pos.y += cc.winSize.height/3;
                pos.x += cc.winSize.width/4;
            }
            if(seq == 3){
                pos.y += cc.winSize.height/2;
            }
            if(seq == 4){
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
                if((PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) && (i == 2 || i == 3)){
                    isShowBtn = true;
                }
                if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ && i == 3){
                    isShowBtn = true;
                }
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
            label.setName("huifanglabel")
        }
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
        PHZRoomModel.banker = 0;
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
            if (PHZRePlayModel.playType == GameTypeEunmZP.SYBP && PHZRePlayModel.closingData[i].strExt[10] != -1){
                // cc.log("PHZRePlayModel.closingData[i].strExt[10] =",PHZRePlayModel.closingData[i].strExt[10]);
                this._players[p.seat].showChuiImg(PHZRePlayModel.closingData[i].strExt[10]);
            }else if (PHZRePlayModel.playType == GameTypeEunmZP.WCPHZ && PHZRePlayModel.closingData[i].strExt[11] != -1){
                this._players[p.seat].showPiaoImg(PHZRePlayModel.closingData[i].strExt[11]);
            }
            this.initCards(seq, p.handCardIds);

            var act = PHZRePlayModel.getCurSeatAct(p.seat,true);
            if(act){
                this.showOptBtn(seq,act);
            }

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
                        if(this.lastPHZChuPai > 80 && (PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.GLZP)){
                            this.getLayout(chuPaiSeq).handleLongBuZi(PHZAI.getPHZDef(this.lastPHZChuPai));
                            this.lastPHZChuPai = 0;
                        }else{
                            this.getLayout(chuPaiSeq).chuPai(PHZAI.getPHZDef(this.lastPHZChuPai));
                        }
                    }
                    this.lastLetOutSeat = seat;
                    if(actType==1){
                        this.lastPHZChuPai = ids[0];
                    }else{
                        this.getLayout(seq).chuPai(PHZAI.getPHZDef(ids[0]));
                    }
                    PHZRoomEffects.chuPai(this.getWidget("cp"+seq),PHZAI.getPHZDef(ids[0]),actType,PHZRePlayModel.players.length,seq);
                    PHZRoomSound.letOutSound(userId,PHZAI.getPHZDef(ids[0]));
                    break;
                case 14://弃胡
                    this._players[seat].showQiHuImg();
                    var temp = [-1,-1];
                    temp[0] = PHZRePlayModel.step;
                    temp[1] = seat;
                    var isPush = true;
                    if (this.showqihu_step.length>0){
                        for (var i = 0; i < this.showqihu_step.length; i++) {
                            if (this.showqihu_step[i][1] == seat){
                                isPush = false;
                            }
                        }
                    }
                    if (isPush){
                        this.showqihu_step.push(temp);
                    }
                    // cc.log("this.showqihu_step3 =",JSON.stringify(this.showqihu_step));
                    break;
                case 15://补牌
                    var layout = this.getLayout(seq);
                    if (!this.isShuangLongBuPai){
                        layout.handcardsid1.push(ids[0]);
                        this.isShuangLongBuPai = true;
                    }
                    var data1 = layout.transData(ArrayUtil.clone(layout.handcardsid1));
                    layout.refreshP1(data1);
                    break;
                case 16:
                    if(PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){//打鸟
                        this._players[seat].showDaNiaoImg(ids);
                        break;
                    }else if(PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ){//补王
                        var layout = this.getLayout(seq);
                        if (!this.isGetWangpai){
                            layout.handcardsid1.push(ids[0]);
                            this.isGetWangpai = true;
                        }   
                        var data1 = layout.transData(ArrayUtil.clone(layout.handcardsid1));
                        layout.refreshP1(data1);
                        break;
                    }
                case 1://胡
                    PHZRoomEffects.huPai(this.root,seq,PHZRePlayModel.players.length);
                    PHZRoomSound.actionSound(userId,"hu");
                    break;
                case 101://过
                    PHZRoomEffects.normalAction("guo",this.root,seq,PHZRePlayModel.players.length);
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

                    if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
                        prefixMap[3] = "wai";
                        prefixMap[4] = prefixMap[11] = prefixMap[18] = "liu";
                    }

                    if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
                        prefixMap[3] = "sao";
                        prefixMap[4] = prefixMap[11] = prefixMap[18] = "saochuan";
                        prefixMap[7] = "kaizhao";
                        prefixMap[10] = "guosao";
                    } else if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                        prefixMap[4] = "zhe";
                    }

                    var prefix = prefixMap[action];
                    if(prefix){
                        PHZRoomEffects.normalAction(prefix,this.root,seq,PHZRePlayModel.players.length);
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
                        }else if(ClosingInfoModel.intParams[6] == 1){
                            string = "庄"+ids[0];
                        }else{
                            string = "庄";
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
                     var mc = null;
                     if(PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH) {
                         mc = new ZZPHSmallResultPop(PHZRePlayModel.closingData, true);
                     }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AXWMQ){
                         mc = new AXWMQSmallResultPop(PHZRePlayModel.closingData, true);
                     }else{
                         mc = new PHZSmallResultPop(PHZRePlayModel.closingData,true);
                     }
                     if (mc){
                         PopupManager.addPopup(mc);
                     }

                 },1800);
            }
        }
    },  

    getLayout:function(direct){
        var layout = this.layouts[direct];
        if(layout){
            return layout;
        }
        layout = new PHZRePlayLayout();
        this.layouts[direct] = layout;
        return layout;
    },

    initCards:function(direct,P1Mahjong){
        var layout = this.getLayout(direct);
        layout.initData(direct,this.getWidget("mPanel"+direct),this.getWidget("oPanel"+direct));
        layout.refresh(P1Mahjong,[],[]);
    }

})