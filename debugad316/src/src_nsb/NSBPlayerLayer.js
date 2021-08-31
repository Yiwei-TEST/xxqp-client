/**
 * Created by cyp on 2019/11/13.
 */
var NSBPlayerLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener(SyEvent.ROOM_FAST_CHAT,this,this.onFastChat);
        SyEventManager.addEventListener(SyEvent.DOUNIU_INTERACTIVE_PROP,this,this.onMagicAction);
        SyEventManager.addEventListener(SyEvent.USER_AUDIO_PLAY_START,this,this.onStartSpeak);
        SyEventManager.addEventListener(SyEvent.USER_AUDIO_PLAY_FINISH,this,this.onStopSpeak);
        SyEventManager.addEventListener(SyEvent.UPDATA_CLUB_TABLE_COIN,this,this.onUpdateClubTableCoin);

        this.initLayer();

    },

    initLayer:function(){
        this.players = [];

        for(var i = 0;i<4;++i){
            var node = new NSBPlayerNode();
            var pos = cc.p(0,0);
            if(i == 0)pos = cc.p(105,60);
            if(i == 1)pos = cc.p(cc.winSize.width - 105,cc.winSize.height/2 + 150);
            if(i == 2)pos = cc.p(cc.winSize.width/2,cc.winSize.height - 90);
            if(i == 3)pos = cc.p(105,cc.winSize.height/2 + 150);
            node.setPosition(pos);
            node.setPosWithIdx(i);
            this.addChild(node);
            this.players.push(node);
        }
    },

    //更新金币房金币数量
    onUpdateClubTableCoin:function(event){
        var message = event.getUserData();
        var data = JSON.parse(message.strParams[0])
        for(var i = 0; i<data.length; i++){
            var userId = data[i].userId;
            var p = NSBRoomModel.getPlayerData(userId);
            var localSeat = NSBRoomModel.getSeqWithSeat(p.seat);
            if(this.players[localSeat - 1]){
                this.players[localSeat - 1].updateClubTableCoin(data[i].coin);
            }
        }
    },

    handleTableData:function(type,data){
        if(type == NSBTabelType.CreateTable){

            for(var i = 0;i<this.players.length;++i){
                this.players[i].cleanData();
            }

            if(this.clearTimeout){
                clearTimeout(this.clearTimeout);
                this.clearTimeout = null;
            }

            for(var i = 0;i<data.players.length;++i){
                var p = data.players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setPlayerWithData(p);
            }
            this.checkIpSame();

        }else if(type == NSBTabelType.JoinTable){
            var p = data.player;
            var seq = NSBRoomModel.getSeqWithSeat(p.seat);
            this.players[seq - 1] && this.players[seq - 1].setPlayerWithData(p);

            this.checkIpSame();
        }else if(type == NSBTabelType.ExitTable){
            for(var i = 0;i<this.players.length;++i){
                if(this.players[i].playerData && this.players[i].playerData.userId == data){
                    this.players[i].cleanData();
                }
            }
            this.checkIpSame();

        }else if(type == NSBTabelType.ChangeState) {
            var seat = data.params[0];
            var seq = NSBRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setReadyState(true);

        }else if(type == NSBTabelType.ChangeTuoGuan){

            var seat = data.params[0];
            var seq = NSBRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setTuoGuanState(data.params[1]);

        }else if(type == NSBTabelType.ChangeOnLine){
            var seat = data[0];
            var seq = NSBRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setOnlineState(data[1] == 2);

        }else if(type == NSBTabelType.DealCard){
            for(var i = 0;i<this.players.length;++i){
                this.players[i].setReadyState(false);
            }
            for(var i = 0;i<NSBRoomModel.players.length;++i){
                var p = NSBRoomModel.players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setRemainCards(p);
            }
        }else if(type == NSBTabelType.FenZu){
            for(var i = 0;i<NSBRoomModel.players.length;++i){
                var p = NSBRoomModel.players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setTipSprWithData(p);
            }
        }else if(type == NSBTabelType.PlayCard){
            if(data.cardType == 1){
                var seq = NSBRoomModel.getSeqWithSeat(data.seat);
                this.players[seq - 1] && this.players[seq - 1].setYaoBuQiSpr(true);
            }else{
                for(var i = 0;i<this.players.length;++i){
                    this.players[i].setYaoBuQiSpr(false);
                }
            }

            var seq = NSBRoomModel.getSeqWithSeat(data.seat);
            var p = NSBRoomModel.getPlayerDataByItem("seat",data.seat);
            //this.players[seq - 1] && this.players[seq - 1].setBaoWangTip(p);

            if(data.cardType == 0){
                this.players[seq - 1] && this.players[seq - 1].setRemainCards(p);
            }

            if(data.isBt > 0){
                for(var i = 0;i<NSBRoomModel.players.length;++i){
                    var p = NSBRoomModel.players[i];
                    var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                    this.players[seq - 1] && this.players[seq - 1].setYouSpr(p);
                }
            }

            for(var i = 0;i<NSBRoomModel.players.length;++i){
                var p = NSBRoomModel.players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setUserScoreWithData(p);
            }

            if(data.isClearDesk){
                this.clearTimeout = setTimeout(function(){
                    for(var i = 0;i<this.players.length;++i){
                        this.players[i].setYaoBuQiSpr(false);
                    }
                }.bind(this),200);
            }
        }else if(type == NSBTabelType.BaoWang){
            for(var i = 0;i<NSBRoomModel.players.length;++i){
                var p = NSBRoomModel.players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setBaoWangTip(p);
            }
        }else if(type == NSBTabelType.MingPai){
            var seat = data.params[0];

            var players = NSBRoomModel.players;
            for(var i = 0;i<players.length;++i){
                var p = players[i];
                var seq = NSBRoomModel.getSeqWithSeat(p.seat);
                if(p.seat == seat){
                    this.players[seq - 1] && this.players[seq - 1].setMingPai(p);
                }
                if(seq > 1 && p.handCardIds.length > 0){
                    this.players[seq - 1] && this.players[seq - 1].setRemainCards(p);
                }
            }
        }
    },

    checkIpSame:function(){
        var players = NSBRoomModel.players;

        for(var i = 0;i<this.players.length;++i){
            this.players[i].setIpSameState(false);
        }

        for(var i = 0;i<players.length;++i){
            for(var j = 0;j<players.length;++j){
                if(i != j && players[i].ip == players[j].ip && players[i].ip){
                    var seq = NSBRoomModel.getSeqWithSeat(players[i].seat);
                    this.players[seq - 1] && this.players[seq - 1].setIpSameState(true);
                }
            }
        }
    },

    //快捷聊天
    onFastChat:function(event){
        var data = event.getUserData();

        var id = data.id;

        var p = NSBRoomModel.getPlayerData(data.userId);
        var localSeat = NSBRoomModel.getSeqWithSeat(p.seat);

        if(id < 0){
            this.playFaceAni(localSeat,data.content);
        }else if(id >= 0){
            var txtStr = "";
            if(id == 0){
                txtStr = data.content;
            } else{
                txtStr = ChatData.pdk_fix_msg[parseInt(id)-1];
            }

            txtStr && this.playTxtAni(localSeat,txtStr);

            if(id >= 200){

            }else if(id > 0){
                var path = (p.sex==1) ? "man/" : "woman/";
                var realPath = "res/audio/fixMsg/"+path+ChatData.pdk_fix_msg_name[id-1]+".m4a";
                AudioManager.play(realPath);
            }
        }

    },

    //魔法表情动作
    onMagicAction:function(event){
        var data = event.getUserData();
        var userId = data.userId;
        var seat = data.seat;
        var type = data.content;

        var from_p = NSBRoomModel.getPlayerData(userId);
        var from_seat = NSBRoomModel.getSeqWithSeat(from_p.seat);
        var to_seat = NSBRoomModel.getSeqWithSeat(seat);

        var from_pos = cc.p(0,0);
        var to_pos = cc.p(0,0);
        if(this.players[from_seat - 1]){
            from_pos = this.players[from_seat - 1].getPosition();
        }
        if(this.players[to_seat - 1]){
            to_pos = this.players[to_seat - 1].getPosition();
        }

        var moveNode = new cc.Sprite("res/ui/emoji/prop" + type + ".png");
        moveNode.setPosition(from_pos);
        this.addChild(moveNode,100);

        var self = this;
        moveNode.runAction(cc.sequence(cc.moveTo(0.5,to_pos),cc.callFunc(function(node){
            self.playMagicAni(to_pos,type);
            node.removeFromParent(true);
        })));

    },

    //播放魔法表情动作
    playMagicAni:function(toPos,type){
        var armatureName = "socialAM"+type;
        var armatureJson = "res/plist/"+armatureName+".ExportJson";
        ccs.armatureDataManager.addArmatureFileInfo(armatureJson);
        var propArmature = new ccs.Armature(armatureName);
        propArmature.setPosition(toPos);

        if(type == 7){
            propArmature.setScale(0.7);
        }
        this.addChild(propArmature,100);

        propArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
            if (evt == "finish") {
                propArmature.getAnimation().stop();
                propArmature.removeFromParent(true);
            }
        });
        var musicName = "res/audio/fixMsg/prop"+type+".mp3";
        AudioManager.play(musicName);
        propArmature.getAnimation().play(armatureName, -1, 0);

    },

    //播放表情动画
    playFaceAni:function(localSeat,aniType){
        var pos = cc.p(0,0);
        if(this.players[localSeat - 1]){
            pos = this.players[localSeat - 1].getPosition();
        }
        if(localSeat == 1){
            pos.x += 30;pos.y += 45;
        }else if(localSeat == 2){
            pos.x -= 30;
        }else if(localSeat == 3){
            pos.y -= 30;
        }else if(localSeat == 4){
            pos.x += 30;
        }

        var armatureJson = "res/plist/faceAM" + aniType + ".ExportJson";
        var armatureName = "faceAM" + aniType;
        ccs.armatureDataManager.addArmatureFileInfo(armatureJson);

        var chatArmature = new ccs.Armature(armatureName);
        chatArmature.setPosition(pos);
        this.addChild(chatArmature, 100);

        var musicName = "res/audio/fixMsg/emoticon_" + aniType + ".mp3";
        AudioManager.play(musicName);

        chatArmature.getAnimation().setFrameEventCallFunc(function (bone, evt) {
            if (evt == "finish") {
                chatArmature.getAnimation().stop();
                chatArmature.removeFromParent(true);
            }
        });
        chatArmature.getAnimation().play(armatureName, -1, 0);
    },

    //播放文字信息
    playTxtAni:function(localSeat,txtStr){
        this.removeChildByName("fastChat_" + localSeat);

        var bg = new cc.Scale9Sprite("res/ui/common/img_14_c.png");
        bg.setName("fastChat_" + localSeat);
        this.addChild(bg,100);

        var label = UICtor.cLabel(txtStr,48);
        label.setTextAreaSize(cc.size(400,0));
        bg.addChild(label);

        var pos = cc.p(0,0);
        if(this.players[localSeat - 1]){
            pos = this.players[localSeat - 1].getPosition();
        }

        if(localSeat == 1){
            pos.x += 75;
            bg.setAnchorPoint(0,0);
        }else if(localSeat == 2){
            pos.x -= 75;
            bg.setAnchorPoint(1,0.5);
        }else if(localSeat == 3){
            pos.x -= 75;pos.y += 45;
            bg.setAnchorPoint(1,1);
        }else if(localSeat == 4){
            pos.x += 75;
            bg.setAnchorPoint(0,0.5);
        }

        bg.setPosition(pos);
        bg.setContentSize(label.width+20,Math.max(90,label.height + 20));
        label.setPosition(bg.width/2 + 10,bg.height/2);

        var action1 = cc.sequence(cc.delayTime(2),cc.fadeOut(0.3));
        label.runAction(action1);

        var action = cc.sequence(cc.delayTime(2),cc.fadeOut(0.3),cc.callFunc(function(node){
            node.removeFromParent(true);
        }));
        bg.runAction(action);

    },

    /**
     * 开始播放语音
     * @param event
     */
    onStartSpeak:function(event){
        var userId = event.getUserData();
        var p =NSBRoomModel.getPlayerData(userId);
        if(p){
            var localSeat = NSBRoomModel.getSeqWithSeat(p.seat);
            this.players[localSeat - 1] && this.players[localSeat - 1].startSpeak();
        }
    },

    /**
     * 语音播完了
     * @param event
     */
    onStopSpeak:function(event){
        var userId = event.getUserData();
        var p =NSBRoomModel.getPlayerData(userId);
        if(p){
            var localSeat = NSBRoomModel.getSeqWithSeat(p.seat);
            this.players[localSeat - 1] && this.players[localSeat - 1].stopSpeak();
        }
    },

    //更新金币房金币数量
    onUpdateClubTableCoin:function(event){
        var message = event.getUserData();
        var data = JSON.parse(message.strParams[0])
        for(var i = 0; i<data.length; i++){
            var userId = data[i].userId;
            var p = NSBRoomModel.getPlayerData(userId);
            if(p) {
                var localSeat = NSBRoomModel.getSeqWithSeat(p.seat);
                if (this.players[localSeat - 1]) {
                    this.players[localSeat - 1].updateClubTableCoin(data[i].coin);
                }
            }
        }
    },
});

var NSBPlayerNode = cc.Node.extend({
    playerData:null,

    ctor:function(){
        this._super();

        this.initNode();
        this.cleanData();
    },

    setPlayerWithData:function(data){
        this.playerData = data;

        this.iconSpr.setVisible(true);
        this.btn_head.setTouchEnabled(true);
        if(this.idx != 0){
            this.infobg.setVisible(true);
        }
        this.fenbg1.setVisible(true);
        this.fenbg2.setVisible(true);


        this.label_name.setString(data.name);

        this.setUserScoreWithData(data);
        this.setYouSpr(data);
        this.setRemainCards(data);
        this.setMingPai(data);
        //this.setBaoWangTip(data);

        if(NSBRoomModel.getIsSwitchCoin()){
            this.image_coin.setVisible(true)
            this.label_coin.setString(""+data.coin)
            this.showHeadFrame(data.frameId)
        }else {
            var credit = "";
            if (data.credit != null) {
                credit = "赛:" + MathUtil.toDecimal(data.credit / 100);
            }
            this.label_sai.setString(credit);
        }

        if(NSBRoomModel.isClubGoldRoom()){
            this.label_sai.setString("豆:" + UITools.moneyToStr(data.gold));
        }

        this.setTipSprWithData(data);
        this.yaobuqiSpr.setVisible(data.ext[5] == 1);

        this.icon_zhunbei.setVisible(data.status == 1);
        this.spr_out_line.setVisible((data.recover.length > 0) && (data.recover[0] != 2));
        this.icon_tuoguan.setVisible(data.ext[3]);

        this.icon_zhuang.setVisible(data.seat == NSBRoomModel.banker);

        this.showIcon(data.icon);
    },

    showHeadFrame:function(frameId){
        if(frameId > 0) {
            var img = "res/ui/bjdmj/popup/pyq/playerinfo/img_vip_head_frame_" + frameId + ".png"
            this.headFrame = this.getChildByName("headFrame")
            if (!this.headFrame) {
                this.headFrame = new cc.Sprite();
                this.addChild(this.headFrame, 10)
                this.headFrame.setPosition(0, 2)
                this.headFrame.setName("headFrame")
                this.headFrame.setScale(0.9)
            }
            this.headFrame.setTexture(img)
        }
    },

    updateClubTableCoin:function(coin){
        if(this.label_coin){
            this.label_coin.setString(coin ||0)
        }
    },

    setMingPai:function(data){
        this.playerData = data;
        this.mingpai_bg.setVisible(data.shiZhongCard == 1);
    },

    setYaoBuQiSpr:function(state){
        this.yaobuqiSpr.setVisible(state);
    },

    setReadyState:function(isReady){
        this.icon_zhunbei.setVisible(isReady);
    },

    setOnlineState:function(isOnline){
        this.spr_out_line.setVisible(!isOnline);
    },

    setTuoGuanState:function(isTuoGuan){
        this.icon_tuoguan.setVisible(isTuoGuan);
    },

    setIpSameState:function(isSame){
        this.icon_ip_same.setVisible(isSame);
    },

    setRemainCards:function(data){
        this.playerData = data;

        //看剩余牌数
        if(!NSBRoomModel.replay && this.idx > 0
            && NSBRoomModel.remain > 0 && data.ext[8] > 0){
            this.paiBei.setVisible(true);
            this.label_num.setString(data.ext[8]);
        }else{
            this.paiBei.setVisible(false);
        }

        if(data.handCardIds.length > 0){
            this.paiBei.setVisible(false);
        }

        if(data.ext[8] > 0 && data.ext[8] < 5){
            this.warningSpr.setVisible(true);
        }else{
            this.warningSpr.setVisible(false);
            this.paiBei.setVisible(false);
        }
    },

    setBaoWangTip:function(data){
        this.playerData = data;
        this.baoWangBg.setVisible(false);
        if(data.outedIds && data.outedIds.length > 0){
            var num1 = 0;var num2 = 0;

            for(var i = 0;i<data.outedIds.length;++i){
                if(data.outedIds[i] == 502)num1++;
                if(data.outedIds[i] == 501)num2++;
            }
            var strArr = [];
            if(num1 > 0)strArr.push("大王x" + num1);
            if(num2 > 0)strArr.push("小王x" + num2);

            if(strArr.length > 0){
                this.baoWangBg.setVisible(true);
                this.label_bao_wang.setString(strArr.join("\n"));
            }
        }
    },

    setUserScoreWithData:function(data){
        this.playerData = data;

        this.label_score.setString(data.point || 0);

        this.label_ext_score.setString(data.ext[2] || 0);

    },

    setYouSpr:function(data){
        this.playerData = data;

        if(data.ext[7] > 0){
            this.youSpr.initWithFile("res/res_nsb/you_" + data.ext[7] + "_icon.png");
            this.youSpr.setVisible(true);
        }else{
            this.youSpr.setVisible(false);
        }
    },

    setTipSprWithData:function(data){
        this.playerData = data;

        var team_type = 0;

        var p = NSBRoomModel.getPlayerDataByItem("seat", NSBRoomModel.mySeat);
        if (data.ext[6] > 0 && p.seat != data.seat && data.ext[6] == p.ext[6]) {
            team_type = 2;
        }

        this.setTipSpr(team_type);
    },

    setTipSpr:function(type){
        if(type == 1){
            this.tipSpr.setVisible(true);
            this.tipSpr.initWithFile("res/res_nsb/duzhan.png");
        }else if(type == 2){
            this.tipSpr.setVisible(true);
            this.tipSpr.initWithFile("res/res_nsb/team_icon.png");
        }else{
            this.tipSpr.setVisible(false);
        }
    },

    initNode:function(){
        var headKuang = new cc.Sprite("res/res_nsb/touxiangkuang.png");
        this.addChild(headKuang);

        var sten=new cc.Sprite("res/res_nsb/touxiangkuang.png");
        var clipnode = new cc.ClippingNode();
        clipnode.setStencil(sten);
        clipnode.setAlphaThreshold(0.8);
        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
        this.iconSpr.setScale(120/this.iconSpr.width);
        clipnode.addChild(this.iconSpr);
        this.addChild(clipnode);

        this.infobg = new cc.Sprite("res/res_nsb/xinxi_di.png");
        this.addChild(this.infobg);

        this.fenbg1 = new cc.Sprite("res/res_nsb/fenshu_di.png");
        this.addChild(this.fenbg1);

        var tip1 = new cc.Sprite("res/res_nsb/fen.png");
        tip1.setPosition(tip1.width/2,this.fenbg1.height/2);
        this.fenbg1.addChild(tip1);

        this.fenbg2 = new cc.Sprite("res/res_nsb/fenshu_di.png");
        this.addChild(this.fenbg2);

        var tip2 = new cc.Sprite("res/res_nsb/zhua.png");
        tip2.setPosition(tip2.width/2,this.fenbg2.height/2);
        this.fenbg2.addChild(tip2);
        this.extFenTip = tip2;

        this.label_name = UICtor.cLabel("玩家的名字",33);
        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_name.setTextAreaSize(cc.size(180,40));
        this.addChild(this.label_name);

        this.label_score = UICtor.cLabel("123",33);
        this.label_score.setColor(cc.color(255,200,61));
        this.addChild(this.label_score);

        this.label_ext_score = UICtor.cLabel("123",33);
        this.addChild(this.label_ext_score);

        this.label_sai = UICtor.cLabel("赛:12345678",33);
        this.label_sai.setColor(cc.color(200,255,50));
        this.addChild(this.label_sai);

        this.image_coin = new cc.Sprite("res/res_nsb/img_jinbi.png");
        this.addChild(this.image_coin);

        this.label_coin = UICtor.cLabel("12345678",33);
        this.label_coin.setColor(cc.color(200,255,50));
        this.label_coin.setAnchorPoint(0,0.5);
        this.addChild(this.label_coin);

        this.icon_tuoguan = new cc.Sprite("res/res_nsb/tuoguan.png");
        this.addChild(this.icon_tuoguan,2);

        this.icon_ip_same = new cc.Sprite("res/res_nsb/ipsame.png");
        this.icon_ip_same.setScale(0.9);
        this.addChild(this.icon_ip_same,2);

        this.spr_out_line = new cc.Sprite("res/res_nsb/img_zl.png");
        this.addChild(this.spr_out_line,3);

        this.icon_zhunbei = new cc.Sprite("res/res_nsb/zhunbei.png");
        this.addChild(this.icon_zhunbei);

        this.yybg = new cc.Sprite("res/res_nsb/img_yybg.png");
        this.yybg.setAnchorPoint(1,0.5);
        this.yybg.setVisible(false);
        this.addChild(this.yybg);

        this.yyts = new cc.Sprite("res/res_nsb/img_yyts.png");
        this.yyts.setPosition(this.yybg.width/2,this.yybg.height/2);
        this.yybg.addChild(this.yyts,1);

        this.btn_head = new ccui.Button("res/ui/bjdmj/popup/light_touming.png");
        this.btn_head.setScale9Enabled(true);
        this.btn_head.setContentSize(headKuang.getContentSize());
        this.addChild(this.btn_head,1);

        this.btn_head.addTouchEventListener(this.onClickBtn,this);

        this.warningSpr = new cc.Sprite("res/res_nsb/warning.png");
        this.addChild(this.warningSpr);

        this.tipSpr = new cc.Sprite("res/res_nsb/duzhan.png");
        this.addChild(this.tipSpr,3);

        this.paiBei = new cc.Sprite("res/res_nsb/paibei.png");
        this.addChild(this.paiBei);

        var txt_shengyu = UICtor.cLabel("剩余",42);
        txt_shengyu.setPosition(this.paiBei.width/2,this.paiBei.height/2 + 30);
        txt_shengyu.setOpacity(120);
        this.paiBei.addChild(txt_shengyu);

        this.label_num = UICtor.cLabel("27",48);
        this.label_num.setPosition(this.paiBei.width/2,this.paiBei.height/2 - 30);
        this.label_num.setOpacity(200);
        this.paiBei.addChild(this.label_num);

        this.baoWangBg = new cc.Scale9Sprite("res/res_nsb/jiugonga1.png");
        this.baoWangBg.setContentSize(105,75);
        this.addChild(this.baoWangBg);

        this.label_bao_wang = UICtor.cLabel("",30);
        this.label_bao_wang.setColor(cc.color.YELLOW);
        this.label_bao_wang.setPosition(this.baoWangBg.width/2,this.baoWangBg.height/2);
        this.baoWangBg.addChild(this.label_bao_wang);

        this.youSpr = new cc.Sprite("res/res_nsb/you_1_icon.png");
        this.addChild(this.youSpr);

        this.yaobuqiSpr = new cc.Sprite("res/res_nsb/yaobuqi.png");
        this.yaobuqiSpr.setScale(0.8);
        this.addChild(this.yaobuqiSpr);

        this.icon_zhuang = new cc.Sprite("res/res_nsb/zhuang.png");
        this.icon_zhuang.setScale(0.8);
        this.addChild(this.icon_zhuang,2);

        this.icon_zhuang.setPosition(-53,-45);

        this.mingpai_bg = new cc.Scale9Sprite("res/res_nsb/baofu_bg.png");
        this.mingpai_bg.setContentSize(120,38);
        this.mingpai_bg.setPosition(0,-38);
        this.addChild(this.mingpai_bg,1);

        var txt_mingPai = UICtor.cLabel("明牌",30);
        txt_mingPai.setPosition(this.mingpai_bg.width/2,this.mingpai_bg.height/2);
        txt_mingPai.setColor(cc.color.RED);
        this.mingpai_bg.addChild(txt_mingPai);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_head){
                var pop = new PlayerInfoPop(this.playerData);
                PopupManager.addPopup(pop);
            }


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    showIcon: function (iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(this.url == iconUrl)return;

        if (iconUrl) {
            var self = this;
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    self.iconSpr.setTexture(img);
                    self.iconSpr.setScale(120/self.iconSpr.width);
                    self.url = iconUrl;
                }
            });
        }else{
            this.iconSpr.initWithFile(defaultimg);
            this.url = defaultimg;
        }
    },

    setPosWithIdx:function(idx){
        this.idx = idx;
        switch (idx) {
            case 0:
                this.label_name.setAnchorPoint(0,0.5);
                this.label_name.setPosition(75,0);

                this.fenbg1.setPosition(165,-40);
                this.fenbg2.setPosition(360,-40);

                this.label_score.setPosition(175,-40);
                this.label_ext_score.setPosition(370,-40);

                this.label_sai.setAnchorPoint(0,0.5);
                this.label_sai.setPosition(280,0);

                this.label_coin.setPosition(300,0);
                this.image_coin.setPosition(270,0)

                this.icon_tuoguan.setPosition(55,55);
                this.icon_zhunbei.setPosition(this.convertToNodeSpace(cc.p(cc.winSize.width/2,225)));
                this.yaobuqiSpr.setPosition(this.convertToNodeSpace(cc.p(cc.winSize.width/2,390)));

                this.yybg.setScaleX(-1);
                this.yybg.setPosition(75,15);

                this.infobg.setVisible(false);
                this.warningSpr.setPosition(0,150);
                this.tipSpr.setPosition(-40,27);
                this.paiBei.setVisible(false);
                this.youSpr.setPosition(0,150);
                this.baoWangBg.setPosition(0,105);
                break;
            case 1:

                this.fenbg1.setPosition(0,-135);
                this.fenbg2.setPosition(0,-180);

                this.label_name.setPosition(0,-90);
                this.label_score.setPosition(8,-135);
                this.label_ext_score.setPosition(8,-180);
                this.label_sai.setPosition(0,-215);
                this.image_coin.setPosition(-60,-215)
                this.label_coin.setPosition(-40,-215);

                this.icon_tuoguan.setPosition(-55,55);
                this.icon_zhunbei.setPosition(-225,0);

                this.yybg.setPosition(-75,15);

                this.infobg.setPosition(0,-150);
                this.warningSpr.setPosition(-150,150);
                this.tipSpr.setPosition(40,27);
                this.paiBei.setPosition(-150,0);
                this.youSpr.setPosition(-150,0);
                this.yaobuqiSpr.setPosition(-330,0);
                this.baoWangBg.setPosition(-150,30);
                break;
            case 2:

                this.fenbg1.setPosition(165,15);
                this.fenbg2.setPosition(165,-30);

                this.label_name.setAnchorPoint(0,0.5);
                this.label_name.setPosition(75,60);

                this.label_score.setPosition(175,15);
                this.label_ext_score.setPosition(175,-30);

                this.label_sai.setPosition(170,-65);
                this.image_coin.setPosition(100,-65)
                this.label_coin.setPosition(120,-65);

                this.icon_tuoguan.setPosition(-55,55);
                this.icon_zhunbei.setPosition(0,-150);
                this.yaobuqiSpr.setPosition(this.icon_zhunbei.getPosition());

                this.yybg.setPosition(-75,15);

                this.infobg.setPosition(165,0);
                this.warningSpr.setPosition(300,0);
                this.tipSpr.setPosition(40,27);
                this.paiBei.setPosition(-150,0);
                this.youSpr.setPosition(-150,0);
                this.baoWangBg.setPosition(-150,30);
                break;
            case 3:

                this.fenbg1.setPosition(0,-135);
                this.fenbg2.setPosition(0,-180);

                this.label_name.setPosition(0,-90);
                this.label_score.setPosition(8,-135);
                this.label_ext_score.setPosition(8,-180);
                this.label_sai.setPosition(0,-215);
                this.image_coin.setPosition(-60,-215)
                this.label_coin.setPosition(-40,-215);
                this.icon_tuoguan.setPosition(55,55);
                this.icon_zhunbei.setPosition(225,0);

                this.yybg.setScaleX(-1);
                this.yybg.setPosition(75,15);

                this.infobg.setPosition(0,-150);
                this.warningSpr.setPosition(0,150);
                this.tipSpr.setPosition(-40,27);
                this.paiBei.setPosition(150,0);
                this.youSpr.setPosition(150,0);
                this.yaobuqiSpr.setPosition(330,0);
                this.baoWangBg.setPosition(150,30);
                break;
            default :

        }

    },

    cleanData:function(){
        this.playerData = null;

        this.iconSpr.setVisible(false);
        this.icon_tuoguan.setVisible(false);
        this.icon_ip_same.setVisible(false);
        this.icon_zhunbei.setVisible(false);
        this.spr_out_line.setVisible(false);
        this.warningSpr.setVisible(false);
        this.tipSpr.setVisible(false);
        this.paiBei.setVisible(false);
        this.youSpr.setVisible(false);
        this.yaobuqiSpr.setVisible(false);

        this.btn_head.setTouchEnabled(false);
        this.yybg.setVisible(false);

        this.label_name.setString("");
        this.label_score.setString("");
        this.label_ext_score.setString("");
        this.label_sai.setString("");

        this.infobg.setVisible(false);
        this.fenbg1.setVisible(false);
        this.fenbg2.setVisible(false);
        this.baoWangBg.setVisible(false);

        this.icon_zhuang.setVisible(false);
        this.mingpai_bg.setVisible(false);

        this.image_coin.setVisible(false);
        this.label_coin.setString("");
        if(this.headFrame) this.headFrame.setVisible(false)
    },

    startSpeak:function(){
        if(this.yybg.visible)
            return;
        this.yybg.visible = true;
        this.yybg.setOpacity(0);
        this.yyts.runAction(cc.fadeTo(0.8,255));
        this.yybg.runAction(cc.fadeTo(0.8,255));
    },

    stopSpeak:function(){
        var self = this;
        var action = cc.sequence(cc.fadeTo(0.8,0),cc.callFunc(function(){
            self.yybg.visible = false;
        }))
        this.yyts.runAction(cc.fadeTo(0.8,0));
        this.yybg.runAction(action);
    },
});