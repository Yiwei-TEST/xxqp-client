/**
 * Created by cyp on 2019/11/13.
 */
var TCGDRoomLayer = TCGDBaseRoomLayer.extend({
    tableMsgArr:null,
    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);

        this.soundHandle = new TCGDRoomSound();

        this.initLayer();
        this.addRoomTitle();
        this.addRoomLayer();
        this.addBottomBtn();
        this.addYuyinRecored();
        this.addRoomBtn();

    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    initLayer:function(){
        var roomInfoBg = new cc.Scale9Sprite("res/res_tcgd/jiugonga1.png");
        roomInfoBg.setAnchorPoint(0,1);
        roomInfoBg.setPosition(180,cc.winSize.height - 23);
        roomInfoBg.setContentSize(240,150);
        this.addChild(roomInfoBg);

        this.label_room_id = UICtor.cLabel("房号:123456",36);
        this.label_room_id.setAnchorPoint(0,0.5);
        this.label_room_id.setPosition(15,roomInfoBg.height - 30);
        roomInfoBg.addChild(this.label_room_id);

        this.label_jushu = UICtor.cLabel("局数:0/10",36);
        this.label_jushu.setAnchorPoint(0,0.5);
        this.label_jushu.setPosition(15,this.label_room_id.y - 45);
        roomInfoBg.addChild(this.label_jushu);

        this.label_room_name = UICtor.cLabel("桐城掼蛋房间名",36);
        this.label_room_name.setAnchorPoint(0,0.5);
        this.label_room_name.setPosition(15,this.label_jushu.y - 45);
        roomInfoBg.addChild(this.label_room_name);

        this.label_rule_tip = new ccui.Text("","",40);
        this.label_rule_tip.setTextAreaSize(cc.size(1200,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color(0,0,0));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 15);
        this.addChild(this.label_rule_tip);

        var btn_bg = new cc.Scale9Sprite("res/res_tcgd/image_xiadi.png");
        btn_bg.setContentSize(cc.winSize.width,btn_bg.height);
        btn_bg.setAnchorPoint(0.5,0);
        btn_bg.setPosition(cc.winSize.width/2,0);
        this.addChild(btn_bg);

    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_tcgd/title_tcgd.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 225);
        this.addChild(spr);
    },

    addBottomBtn:function(){

        var img = "res/res_tcgd/huatong.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(cc.winSize.width - 90,375);
        this.addChild(this.btn_yuyin);

        img = "res/res_tcgd/liaotian.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(this.btn_yuyin.x - 150,this.btn_yuyin.y);
        this.addChild(this.btn_chat);
        this.btn_chat.setVisible(false);

        this.btn_chat.setScale(0.8);
        this.btn_yuyin.setScale(0.8);

        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);


        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
        }
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new TCGDPlayerLayer(),2);
        this.addChild(this.cardLayer = new TCGDCardLayer(),1);
        this.addChild(this.optBtnLayer = new TCGDOptBtnLayer(),10);
    },

    addRoomBtn:function(){
        var isQyqRoom = TCGDRoomModel.tableType == 1;

        var img_wx = "res/res_tcgd/btn_invite.png";
        if(isQyqRoom)img_wx = "res/ui/bjdmj/wx_invite.png";
        var img_qyq = "res/ui/bjdmj/qyq_invite.png";
        var img_back = "res/ui/bjdmj/back_qyq_hall.png";

        this.roomBtnContent = new cc.Node();
        this.roomBtnContent.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 120);
        this.addChild(this.roomBtnContent);

        var btnArr = [];

        this.btn_invite_wx = new ccui.Button(img_wx,img_wx);
        this.roomBtnContent.addChild(this.btn_invite_wx);
        btnArr.push(this.btn_invite_wx);

        if(isQyqRoom){
            if(ClickClubModel.getIsForbidInvite()){
                if(TCGDRoomModel.privateRoom == 1){
                    img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
                }
                this.btn_invite_qyq = new ccui.Button(img_qyq,img_qyq);
                this.roomBtnContent.addChild(this.btn_invite_qyq);
                btnArr.push(this.btn_invite_qyq);
            }

            this.btn_qyq_back = new ccui.Button(img_back,img_back);
            this.roomBtnContent.addChild(this.btn_qyq_back);
            btnArr.push(this.btn_qyq_back);
        }

        var offsetX = 350;
        var startX = -(btnArr.length - 1)/2 * offsetX;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].setPosition(startX + offsetX*i,0);
            btnArr[i].addTouchEventListener(this.onClickBtn,this);
        }

        var img_ready = "res/res_tcgd/btn_ready.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,225);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        //this.roomBtnContent.setVisible(false);
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/res_tcgd/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(500,315);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/res_tcgd/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/res_tcgd/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 38);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = UICtor.cLabel("手指上滑取消发送",42);
        tipLabel.setPosition(this.yuyinBg.width/2,45);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/res_tcgd/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/res_tcgd/huatong.png","res/res_tcgd/huatong.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(100);
        this.recordBtn.setBright(IMSdkUtil.isReady());

        this.yuyinBg.setVisible(false);
    },

    /**
     * sdk调用，当语音使用状态改变
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        this.recordBtn.setBright(useful);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_invite_wx){
                this.onInvite();
            }else if(sender == this.btn_invite_qyq){
                var inviteType = 0
                if(TCGDRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                this.addChild(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_chat){
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "桐城掼蛋";
        var queZi = TCGDRoomModel.renshu + "缺"+(TCGDRoomModel.renshu - TCGDRoomModel.players.length);
        var obj={};
        obj.tableId=TCGDRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+TCGDRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+TCGDRoomModel.tableId+"] "+queZi;

        var youxiName = "桐城掼蛋";
        if(TCGDRoomModel.tableType == 1){
            youxiName = "[亲友圈]桐城掼蛋"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,TCGDRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "TCGD_ROOM";
    },

    update:function(){
        if(TCGDRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
            var event = this.tableMsgArr.shift();
            this.handleTableData(event.eventType,event.getUserData());
        }
    },

    onGetTableData:function(event){
        this.tableMsgArr.push(event);
    },

    handleTableData:function(type,data){
        var date = new Date();
        cc.log("=============handleTableData=============",type,date.getSeconds(),date.getMilliseconds());
        var state = TCGDRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == TCGDTabelType.CreateTable){
            this.tableMsgArr = [];

            sy.scene.hideLoading();
            this.removeScoreLayer();
            this.updateRoomInfo();
            this.updateRoomBtnState();
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.setRuleTip();

            this.setChatBtnOpacity();

            if(TCGDRoomModel.nowBurCount == 1
                && TCGDRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

        }else if(type == TCGDTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == TCGDTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == TCGDTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == TCGDTabelType.DealCard){
            this.updateRoomTip();

            if(data.dealDice > 0){
                this.showMoDuiCard(data.dealDice);
            }

        }else if(type == TCGDTabelType.PlayCard){
            this.updateRoomTip();

            if(data.cardType == 1 && data.isFirstOut){
                var seq = TCGDRoomModel.getSeqWithSeat(TCGDRoomModel.nextSeat);
                this.playJieFeng(seq);
            }

        }else if(type == TCGDTabelType.OnOver){
            var SmallResultLayer = TCGDRoomModel.getSamllResultLayer();
            if(data.isBreak){

            }else{
                //延时弹出小结算
                setTimeout(function(){
                    var layer = new SmallResultLayer(data);
                    PopupManager.addPopup(layer);
                },1000);
            }
        }else if(type == TCGDTabelType.MingPai){
            this.setChatBtnOpacity();
        }else if(type == TCGDTabelType.ShowHong3){
            if(data.params[0] > 0 && data.params[0] == data.params[1]){
                var seq = TCGDRoomModel.getSeqWithSeat(data.params[0]);
                this.showFirstOutCard([303,303],seq);
            }else{
                for(var i = 0;i<2;++i){
                    if(data.params[i] > 0){
                        var seq = TCGDRoomModel.getSeqWithSeat(data.params[i]);
                        this.showFirstOutCard([303],seq);
                    }
                }
            }

            this.showFirstOutTip();

        }else if(type == TCGDTabelType.SwitchSeat){

            var switchArr = TCGDRoomModel.switchDataArr;

            for(var i = 1;i<=5;++i){
                var card = this.getChildByName("Hong3_" + i);
                if(card){
                    for(var j = 0;j<switchArr.length;++j){
                        var item = switchArr[j];
                        if(card.seq == item.oldSeq){
                            var pos = this.getHong3Pos(item.newSeq);
                            card.runAction(cc.moveTo(0.8,pos));
                            break;
                        }
                    }
                }
            }

            var spr = this.getChildByName("Tip_First_Out");
            if(spr){
                for(var j = 0;j<switchArr.length;++j){
                    var item = switchArr[j];
                    if(spr.seq == item.oldSeq){
                        var pos = this.getHong3Pos(item.newSeq);
                        spr.runAction(cc.moveTo(0.8,pos));
                        break;
                    }
                }
            }

        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    showMoDuiCard:function(id){
        if(!id)return;

        var card = new TCGDCard(id);
        card.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 150);
        card.setScale(0);
        this.addChild(card,20);

        var action = cc.sequence(cc.scaleTo(0.2,1),cc.delayTime(0.8),cc.callFunc(function(node){
            node.removeFromParent(true)
        }));

        card.runAction(action);
    },

    getHong3Pos:function(seq){
        var pos = cc.p(cc.winSize.width/2,cc.winSize.height/2 + 150);
        if(seq == 1)pos.y -= 225;
        if(seq == 2)pos.x += 600;
        if(seq == 3)pos.y += 120;
        if(seq == 4)pos.x -= 600;

        return pos;
    },

    showFirstOutCard:function(ids,seq){
        if(!ids || ids.length == 0)return;

        var pos = this.getHong3Pos(seq);

        for(var i = 0;i<ids.length;++i){
            pos.x += i*60;
            var card = new TCGDCard(ids[i]);
            card.setPosition(pos);
            card.setScale(0);
            card.seq = seq;
            card.setName("Hong3_" + (i + seq));
            card.setColor(cc.color(255,100,100));
            this.addChild(card,20);

            var action = cc.sequence(cc.scaleTo(0.3,1),cc.delayTime(1.5),cc.callFunc(function(node){
                node.removeFromParent(true);
            }));

            card.runAction(action);
        }
    },

    showFirstOutTip:function(){
        var seq = TCGDRoomModel.getSeqWithSeat(TCGDRoomModel.nextSeat);
        var pos = this.getHong3Pos(seq);
        var spr = new cc.Sprite("res/res_tcgd/tip_first_out.png");
        spr.setPosition(pos);
        spr.setScale(0);
        spr.seq = seq;
        spr.setName("Tip_First_Out");
        this.addChild(spr,21);

        spr.runAction(cc.sequence(cc.scaleTo(1,1).easing(cc.easeElasticOut(0.2)),
            cc.delayTime(0.5),cc.callFunc(function(node){
                node.removeFromParent(true);
            })));
    },

    playJieFeng:function(seq){
        var spr = new cc.Sprite("res/res_tcgd/jiefeng.png");

        var pos = this.getHong3Pos(seq);

        spr.setPosition(pos);

        this.addChild(spr,10);

        spr.setScale(0);
        spr.runAction(cc.sequence(cc.scaleTo(1,1).easing(cc.easeElasticOut(0.2)),
            cc.delayTime(0.5),cc.callFunc(function(node){
                node.removeFromParent(true);
            })));
    },

    showScoreLayer:function(type){
        this.removeScoreLayer();

        var layer = new TCGDShowScoreLayer(type);
        layer.setName("ScoreLayer");
        this.addChild(layer,20);
    },

    removeScoreLayer:function(){
        var layer = this.getChildByName("ScoreLayer");
        layer && layer.removeFromParent(true);
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getTCGDWanfa(TCGDRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + TCGDRoomModel.tableId);
        var jushuStr = "局数:" + TCGDRoomModel.nowBurCount;
        if(TCGDRoomModel.totalBurCount < 100){
            jushuStr += ("/" + TCGDRoomModel.totalBurCount);
        }
        this.label_jushu.setString(jushuStr);
        this.label_room_name.setString(TCGDRoomModel.roomName || "桐城掼蛋");

        if(!TCGDRoomModel.replay){
            this.btn_chat.setLocalZOrder(2);
            this.btn_yuyin.setLocalZOrder(2);
        }
    },

    //本地座位为1的玩家如果明牌了，吧按钮透明化处理，可以看到下面的牌
    setChatBtnOpacity:function(){
        var opacity = 255;

        var seat = TCGDRoomModel.getSeatWithSeq(2);
        var p = TCGDRoomModel.getPlayerDataByItem("seat",seat);

        if(p && p.shiZhongCard == 1)opacity = 100;

        this.btn_chat.setOpacity(opacity);
        this.recordBtn.prog.setOpacity(opacity);
    },

    updateRoomBtnState:function(){
        this.roomBtnContent.setVisible(TCGDRoomModel.players.length < TCGDRoomModel.renshu);
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = TCGDRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
    },
});