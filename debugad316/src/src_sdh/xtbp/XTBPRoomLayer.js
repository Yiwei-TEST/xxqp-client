/**
 * Created by cyp on 2019/12/27.
 */

var XTBPRoomLayer = SDHRoomLayer.extend({

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_sdh/title_xtbp.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 135);
        this.addChild(spr);
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new XTBPPlayerLayer(),2);
        this.addChild(this.cardLayer = new SDHCardLayer(),1);
        this.addChild(this.optBtnLayer = new XTBPOptBtnLayer(),10);
        this.addChild(this.jiaoFenBtnLayer = new XTBPJiaoFenBtnLayer(),9);
        this.addChild(this.selectZhuLayer = new XTBPSelectZhuLayer(),11);

    },

    addBottomBtn:function(){
        this._super();

        var img = "res/res_sdh/btn_hlm.png";
        this.btn_hlm = new ccui.Button(img,img,"");
        this.btn_hlm.setPosition(this.btn_dipai.x,this.btn_dipai.y);
        this.addChild(this.btn_hlm,3);

        img = "res/res_sdh/btn_kanfen.png";
        this.btn_kanfen = new ccui.Button(img,img,"");
        this.btn_kanfen.setPosition(this.btn_dipai.x*2 - this.btn_card_record.x,this.btn_dipai.y);
        this.addChild(this.btn_kanfen,2);

        this.btn_hlm.addTouchEventListener(this.onClickBtn,this);
        this.btn_kanfen.addTouchEventListener(this.onClickBtn,this);

    },

    onClickBtn:function(sender,type){
        this._super(sender,type);

        if(type == ccui.Widget.TOUCH_ENDED){

            if(sender == this.btn_hlm){
                sySocket.sendComReqMsg(9,[300],[]);
            }else if(sender == this.btn_kanfen){
                var pop = new XTBPShowScoreLayer();
                PopupManager.addPopup(pop);
            }
        }
    },

    updateRoomInfo:function(){
        this._super();

        this.label_room_name.setString(SDHRoomModel.roomName || "新田包牌");
    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getXTBPWanfa(SDHRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateDiPaiBtnState:function(){
        this._super();

        if(SDHRoomModel.intParams[17] != 1 && !SDHRoomModel.replay){
            this.btn_dipai.setBright(false);
            this.btn_dipai.setTouchEnabled(false);
        }
    },

    updateLaiMiBtnState:function(){
        if((SDHRoomModel.intParams[19] == 1) && (SDHRoomModel.remain == 4)
            && (SDHRoomModel.banker != SDHRoomModel.mySeat && !SDHRoomModel.replay)){
            this.btn_hlm.setVisible(true);
        }else{
            this.btn_hlm.setVisible(false);
        }
    },

    updateKanfenBtnState:function(){
        if(SDHRoomModel.intParams[18] == 1 && SDHRoomModel.remain == 4 && !SDHRoomModel.replay){
            this.btn_kanfen.setVisible(true);
        }else{
            this.btn_kanfen.setVisible(false);
        }
    },

    handleTableData:function(type,data){

        this._super(type,data);

        if(type == SDHTabelType.CreateTable){
            this.updateLaiMiBtnState();
            this.updateKanfenBtnState();
        }else if(type == "PiaoFen"){
            this.updateRoomTip();
        }else if(type == SDHTabelType.PlayCard){
            if(data.cardType == 100){
                this.updateLaiMiBtnState();
                this.updateKanfenBtnState();
            }
        }

    },

    updateRoomTip:function(){
        this._super();
        if(SDHRoomModel.remain == 8){
            var p = SDHRoomModel.getPlayerDataByItem("seat",SDHRoomModel.mySeat);
            if(p && p.ext[6] >= 0){
                this.spr_tip.initWithFile("res/res_sdh/imgPiao/img_piaofen.png");
                this.spr_tip.setVisible(true);
            }
        }
    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "新田包牌";
        var queZi = SDHRoomModel.renshu + "缺"+(SDHRoomModel.renshu - SDHRoomModel.players.length);
        var obj={};
        obj.tableId=SDHRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+SDHRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+SDHRoomModel.tableId+"] "+queZi;

        var youxiName = "新田包牌";
        if(SDHRoomModel.tableType == 1){
            youxiName = "[亲友圈]新田包牌"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,SDHRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "XTBP_ROOM";
    },

});

