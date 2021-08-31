/**
 * Created by cyp on 2019/6/22.
 */
var CDTLJPlayerLayer = cc.Layer.extend({
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
            var node = new CDTLJPlayerNode();
            var pos = cc.p(0,0);
            if(i == 0)pos = cc.p(105,60);
            if(i == 1)pos = cc.p(cc.winSize.width - 105,cc.winSize.height/2 + 150);
            if(i == 2)pos = cc.p(cc.winSize.width/2 + 150,cc.winSize.height - 90);
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
            var p = CDTLJRoomModel.getPlayerData(userId);
            var localSeat = CDTLJRoomModel.getSeqWithSeat(p.seat);
            if(this.players[localSeat - 1]){
                this.players[localSeat - 1].updateClubTableCoin(data[i].coin);
            }
        }
    },

    handleTableData:function(type,data){
        if(type == CDTLJTabelType.CreateTable){
            this.players[2].setVisible(CDTLJRoomModel.renshu == 4);

            for(var i = 0;i<this.players.length;++i){
                this.players[i].cleanData();
            }

            for(var i = 0;i<data.players.length;++i){
                var p = data.players[i];
                var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setPlayerWithData(p);
            }
            this.checkIpSame();
        }else if(type == CDTLJTabelType.JoinTable){
            var p = data.player;
            var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
            this.players[seq - 1] && this.players[seq - 1].setPlayerWithData(p);

            this.checkIpSame();
        }else if(type == CDTLJTabelType.ExitTable){
            for(var i = 0;i<this.players.length;++i){
                if(this.players[i].playerData && this.players[i].playerData.userId == data){
                    this.players[i].cleanData();
                }
            }
            this.checkIpSame();
        }else if(type == CDTLJTabelType.ChangeState) {
            var seat = data.params[0];
            var seq = CDTLJRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setReadyState(true);
        }else if(type == CDTLJTabelType.ChangeTuoGuan){

            var seat = data.params[0];
            var seq = CDTLJRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setTuoGuanState(data.params[1]);

        }else if(type == CDTLJTabelType.ChangeOnLine){
            var seat = data[0];
            var seq = CDTLJRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setOnlineState(data[1] == 2);
        }else if(type == CDTLJTabelType.DealCard){
            for(var i = 0;i<this.players.length;++i){
                this.players[i].setReadyState(false);

                //重新发牌清理上次叫分
                if(this.players[i].playerData){
                    this.players[i].setJiaoFenStr(-1);
                }
            }
        }else if(type == CDTLJTabelType.JiaoFen){


        }else if(type == CDTLJTabelType.DingZhuang){
            for(var i = 0;i<CDTLJRoomModel.players.length;++i){
                var p = CDTLJRoomModel.players[i];
                var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
                if(this.players[seq - 1]){
                    this.players[seq - 1].setJiaoFenStr();
                    this.players[seq - 1].setZhuangState(p.seat == data.strParams[0]);
                }
            }
        }else if(type == CDTLJTabelType.XuanLiuShou){
            var seat = data.params[0];
            var p = CDTLJRoomModel.getPlayerDataByItem("seat",seat);
            var seq = CDTLJRoomModel.getSeqWithSeat(seat);
            this.players[seq - 1] && this.players[seq - 1].setBaofuTip(p);
        }else if(type == CDTLJTabelType.PlayCard){
            if(data.cardType == 0){
                var seat = data.seat;
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",seat);
                var seq = CDTLJRoomModel.getSeqWithSeat(seat);
                this.players[seq - 1] && this.players[seq - 1].setBaofuTip(p);
            }
        }else if(type == "YYBS_ZDY"){
            if(data.params[0] == 1){
                var p = CDTLJRoomModel.getPlayerDataByItem("seat",data.params[1]);
                var seq = CDTLJRoomModel.getSeqWithSeat(p.seat);
                this.players[seq - 1] && this.players[seq - 1].setTipSpr(1);
            }
        }
    },

    checkIpSame:function(){
        var players = CDTLJRoomModel.players;

        for(var i = 0;i<this.players.length;++i){
            this.players[i].setIpSameState(false);
        }

        for(var i = 0;i<players.length;++i){
            for(var j = 0;j<players.length;++j){
                if(i != j && players[i].ip == players[j].ip && players[i].ip){
                    var seq = CDTLJRoomModel.getSeqWithSeat(players[i].seat);
                    this.players[seq - 1] && this.players[seq - 1].setIpSameState(true);
                }
            }
        }
    },

    //快捷聊天
    onFastChat:function(event){
        var data = event.getUserData();

        var id = data.id;

        var p = CDTLJRoomModel.getPlayerData(data.userId);
        var localSeat = CDTLJRoomModel.getSeqWithSeat(p.seat);

        if(id < 0){
            this.playFaceAni(localSeat,data.content);
        }else if(id >= 0){
            var txtStr = "";
            if(id == 0)txtStr = data.content;
            else txtStr = ChatData.pdk_fix_msg[parseInt(id)-1];

            txtStr && this.playTxtAni(localSeat,txtStr);

            if(id > 0){
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

        var from_p = CDTLJRoomModel.getPlayerData(userId);
        var from_seat = CDTLJRoomModel.getSeqWithSeat(from_p.seat);
        var to_seat = CDTLJRoomModel.getSeqWithSeat(seat);

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

        var bg = new cc.Scale9Sprite("res/res_cdtlj/img_14_c.png");
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
        bg.setContentSize(label.width+20,Math.max(80,label.height + 20));
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
        var p =CDTLJRoomModel.getPlayerData(userId);
        if(p){
            var localSeat = CDTLJRoomModel.getSeqWithSeat(p.seat);
            this.players[localSeat - 1] && this.players[localSeat - 1].startSpeak();
        }
    },

    /**
     * 语音播完了
     * @param event
     */
    onStopSpeak:function(event){
        var userId = event.getUserData();
        var p =CDTLJRoomModel.getPlayerData(userId);
        if(p){
            var localSeat = CDTLJRoomModel.getSeqWithSeat(p.seat);
            this.players[localSeat - 1] && this.players[localSeat - 1].stopSpeak();
        }
    },
});

var CDTLJPlayerNode = cc.Node.extend({
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

        this.label_name.setString(data.name);
        this.label_score.setString("分:" + data.point);

        if(CDTLJRoomModel.getIsSwitchCoin()){
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

        if(CDTLJRoomModel.isClubGoldRoom()){
            this.label_sai.setString("豆:" + UITools.moneyToStr(data.gold));
        }

        this.setJiaoFenStr();

        this.setTipSprWithData(data);

        this.icon_zhunbei.setVisible(data.status == 1);
        this.spr_out_line.setVisible((data.recover.length > 0) && (data.recover[0] != 2));
        this.icon_zhuang.setVisible(data.seat == CDTLJRoomModel.banker);
        this.icon_tuoguan.setVisible(data.ext[3]);

        this.setBaofuTip(data);

        if(CDTLJRoomModel.isFzbHide() && !CDTLJRoomModel.replay && this.idx > 0){
            this.label_name.setString("玩家" + (this.idx + 1));
            this.label_sai.setString("");
            data.icon = "res/res_icon/icon_fang.png";
        }

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

    setBaofuTip:function(data){
        if(data.ext[2] == 1){
            this.baofu_bg.setVisible(true);
            this.baofu_tip.setString("报副");
            if(data.ext[4] > 0){
                var tipArr = ["","留守方块","留守梅花","留守红桃","留守黑桃","不留守"];
                if(tipArr[data.ext[4]]){
                    this.baofu_tip.setString(tipArr[data.ext[4]]);
                }
            }
        }else{
            this.baofu_bg.setVisible(false);
        }
    },

    setReadyState:function(isReady){
        this.icon_zhunbei.setVisible(isReady);
    },

    setOnlineState:function(isOnline){
        this.spr_out_line.setVisible(!isOnline);
    },

    setJiaoFenStr:function(data){
        this.label_JiaoFen.setString("");
    },

    setZhuangState:function(isZhuang){
        this.icon_zhuang.setVisible(isZhuang);
    },

    setTuoGuanState:function(isTuoGuan){
        this.icon_tuoguan.setVisible(isTuoGuan);
    },

    setIpSameState:function(isSame){
        this.icon_ip_same.setVisible(isSame);
    },

    setTipSprWithData:function(data){
        this.playerData = data;

        var team_type = 0;

        if(CDTLJRoomModel.ext[18] == 1){//一打三
            if(data.seat == CDTLJRoomModel.banker)team_type = 1;
        }else{//找队友
            var p = CDTLJRoomModel.getPlayerDataByItem("seat",CDTLJRoomModel.mySeat);
            if(data.ext[7] > 0 && p.seat != data.seat && data.ext[7] == p.ext[7]){
                team_type = 2;
            }
        }
        this.setTipSpr(team_type);
    },

    setTipSpr:function(type){
        if(type == 1){
            this.tipSpr.setVisible(true);
            this.tipSpr.initWithFile("res/res_cdtlj/duzhan.png");
        }else if(type == 2){
            this.tipSpr.setVisible(true);
            this.tipSpr.initWithFile("res/res_cdtlj/team_icon.png");
        }else{
            this.tipSpr.setVisible(false);
        }
    },

    initNode:function(){
        var headKuang = new cc.Sprite("res/res_cdtlj/touxiangkuang.png");
        this.addChild(headKuang);

        var sten=new cc.Sprite("res/res_cdtlj/touxiangkuang.png");
        var clipnode = new cc.ClippingNode();
        clipnode.setStencil(sten);
        clipnode.setAlphaThreshold(0.8);
        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
        this.iconSpr.setScale(120/this.iconSpr.width);
        clipnode.addChild(this.iconSpr);
        this.addChild(clipnode);

        this.label_name = UICtor.cLabel("玩家的名字",36);
        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_name.setTextAreaSize(cc.size(200,40));
        this.addChild(this.label_name);

        this.label_score = UICtor.cLabel("分:12345",36);
        this.label_score.setColor(cc.color(255,200,61));
        this.addChild(this.label_score);

        this.label_sai = UICtor.cLabel("赛:12345678",36);
        this.label_sai.setColor(cc.color(200,255,50));
        this.addChild(this.label_sai);

        this.image_coin = new cc.Sprite("res/res_cdtlj/img_jinbi.png");
        this.addChild(this.image_coin);

        this.label_coin = UICtor.cLabel("12345678",33);
        this.label_coin.setColor(cc.color(200,255,50));
        this.label_coin.setAnchorPoint(0,0.5);
        this.addChild(this.label_coin);

        this.icon_zhuang = new cc.Sprite("res/res_cdtlj/zhuang.png");
        this.icon_zhuang.setScale(0.8);
        this.addChild(this.icon_zhuang,2);

        this.icon_tuoguan = new cc.Sprite("res/res_cdtlj/tuoguan.png");
        this.addChild(this.icon_tuoguan,2);

        this.icon_ip_same = new cc.Sprite("res/res_cdtlj/ipsame.png");
        this.icon_ip_same.setScale(0.9);
        this.addChild(this.icon_ip_same,2);

        this.spr_out_line = new cc.Sprite("res/res_cdtlj/img_zl.png");
        this.addChild(this.spr_out_line,3);

        this.icon_zhunbei = new cc.Sprite("res/res_cdtlj/zhunbei.png");
        this.addChild(this.icon_zhunbei);

        this.label_JiaoFen = new cc.LabelBMFont("","res/res_cdtlj/font/show_jiaofen.fnt");
        this.addChild(this.label_JiaoFen);

        this.baofu_bg = new cc.Scale9Sprite("res/res_cdtlj/baofu_bg.png");
        this.baofu_bg.setContentSize(120,38);
        this.baofu_bg.setPosition(0,-38);
        this.addChild(this.baofu_bg,1);

        this.baofu_tip = UICtor.cLabel("报副",30);
        this.baofu_tip.setPosition(this.baofu_bg.width/2,this.baofu_bg.height/2);
        this.baofu_tip.setColor(cc.color.RED);
        this.baofu_bg.addChild(this.baofu_tip);

        this.yybg = new cc.Sprite("res/res_cdtlj/img_yybg.png");
        this.yybg.setAnchorPoint(1,0.5);
        this.yybg.setVisible(false);
        this.addChild(this.yybg);

        this.yyts = new cc.Sprite("res/res_cdtlj/img_yyts.png");
        this.yyts.setPosition(this.yybg.width/2,this.yybg.height/2);
        this.yybg.addChild(this.yyts,1);

        this.btn_head = new ccui.Button("res/ui/bjdmj/popup/light_touming.png");
        this.btn_head.setScale9Enabled(true);
        this.btn_head.setContentSize(headKuang.getContentSize());
        this.addChild(this.btn_head,1);

        this.btn_head.addTouchEventListener(this.onClickBtn,this);

        this.tipSpr = new cc.Sprite("res/res_cdtlj/duzhan.png");
        this.addChild(this.tipSpr,3);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_head){
                var data = ObjectUtil.deepCopy(this.playerData);

                if(CDTLJRoomModel.isFzbHide()){
                    return;
                    data.name = "玩家" + (this.idx + 1);
                    data.userId = "******";
                    data.icon = "res/res_icon/icon_fang.png";
                }

                var pop = new PlayerInfoPop(data);
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
                this.label_name.setPosition(75,-23);

                this.label_score.setAnchorPoint(0,0.5);
                this.label_score.setPosition(270,-23);

                this.label_sai.setAnchorPoint(0,0.5);
                this.label_sai.setPosition(430,-23);

                this.icon_zhuang.setPosition(-55,55);
                this.icon_tuoguan.setPosition(55,55);
                this.icon_zhunbei.setPosition(this.convertToNodeSpace(cc.p(cc.winSize.width/2,300)));

                this.yybg.setScaleX(-1);
                this.yybg.setPosition(75,15);

                this.label_coin.setPosition(450,-23);
                this.image_coin.setPosition(430,-23);

                this.tipSpr.setPosition(-40,27);
                break;
            case 1:
                this.label_name.setPosition(0,-80);
                this.label_score.setPosition(0,-120);
                this.label_sai.setPosition(0,-160);
                this.icon_zhuang.setPosition(55,55);
                this.icon_tuoguan.setPosition(-55,55);
                this.icon_zhunbei.setPosition(-230,0);

                this.yybg.setPosition(-75,15);
                this.image_coin.setPosition(-45,-160);
                this.label_coin.setPosition(-23,-160);

                this.tipSpr.setPosition(40,27);
                break;
            case 2:
                this.label_name.setAnchorPoint(1,0.5);
                this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
                this.label_name.setPosition(-75,40);

                this.label_score.setAnchorPoint(1,0.5);
                this.label_score.setPosition(-75,0);

                this.label_sai.setAnchorPoint(1,0.5);
                this.label_sai.setPosition(-75,-40);

                this.icon_zhuang.setPosition(55,55);
                this.icon_tuoguan.setPosition(-55,55);
                this.icon_zhunbei.setPosition(0,-150);

                this.yybg.setPosition(-75,15);
                this.image_coin.setPosition(-200,-40);
                this.label_coin.setPosition(-175,-40);

                this.tipSpr.setPosition(40,27);
                break;
            case 3:
                this.label_name.setPosition(0,-80);
                this.label_score.setPosition(0,-120);
                this.label_sai.setPosition(0,-160);
                this.icon_zhuang.setPosition(-55,55);
                this.icon_tuoguan.setPosition(55,55);
                this.icon_zhunbei.setPosition(230,0);

                this.yybg.setScaleX(-1);
                this.yybg.setPosition(75,15);
                this.image_coin.setPosition(-45,-160)
                this.label_coin.setPosition(-23,-160);

                this.tipSpr.setPosition(-40,27);
                break;
            default :

        }

        this.label_JiaoFen.setPosition(this.icon_zhunbei.getPosition());
        if(idx == 0)this.label_JiaoFen.y += 160;
    },

    cleanData:function(){
        this.playerData = null;

        this.iconSpr.setVisible(false);
        this.icon_zhuang.setVisible(false);
        this.icon_tuoguan.setVisible(false);
        this.icon_ip_same.setVisible(false);
        this.icon_zhunbei.setVisible(false);
        this.spr_out_line.setVisible(false);
        this.baofu_bg.setVisible(false);
        this.tipSpr.setVisible(false);

        this.btn_head.setTouchEnabled(false);
        this.yybg.setVisible(false);

        this.label_name.setString("");
        this.label_score.setString("");
        this.label_sai.setString("");
        this.label_JiaoFen.setString("");

        this.image_coin.setVisible(false);
        this.label_coin.setString("");
        if(this.headFrame) this.headFrame.setVisible(false);

        if(CDTLJRoomModel.isFzbHide() && !CDTLJRoomModel.replay){
            this.iconSpr.setVisible(true);
            this.iconSpr.initWithFile("res/res_icon/icon_fang.png");
            this.iconSpr.setScale(120/this.iconSpr.width);
            if(this.idx >= 0){
                this.label_name.setString("玩家" + (this.idx + 1));
            }
        }
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