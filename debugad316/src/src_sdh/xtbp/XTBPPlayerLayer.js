/**
 * Created by cyp on 2019/12/27.
 */
var XTBPPlayerLayer = SDHPlayerLayer.extend({

    initLayer:function(){
        this.players = [];

        for(var i = 0;i<4;++i){
            var node = new XTBPPlayerNode();
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

    handleTableData:function(type,data){
        this._super(type,data);

        if(type == "PiaoFen"){
            if(data.params[0] == 1){
                var temp = JSON.parse(data.strParams[0]);
                var seq = SDHRoomModel.getSeqWithSeat(temp.seat);
                this.players[seq - 1] && this.players[seq - 1].setPiaoNum(temp.piaofen);
            }
        }
    },

    //快捷聊天
    onFastChat:function(event){
        this._super(event);

        var data = event.getUserData();

        var id = data.id;

        var p = SDHRoomModel.getPlayerData(data.userId);
        var localSeat = SDHRoomModel.getSeqWithSeat(p.seat);

        if(id == 300){
            this.playTxtAni(localSeat,"来米来米");
        }
    },

});

var XTBPPlayerNode = SDHPlayerNode.extend({

    initNode:function(){
        this._super();

        this.icon_piao = new cc.Sprite("res/res_sdh/imgPiao/icon_piao_0.png");
        this.icon_piao.setScale(0.8);
        this.addChild(this.icon_piao,5);

    },

    setPlayerWithData:function(data){
        this._super(data);

        this.setPiaoNum(data.ext[6]);
    },

    setBaofuTip:function(data){
        this.baofu_bg.setVisible(false);
    },

    setPiaoNum:function(num){
        if(num >= 0 && num <= 3){
            this.icon_piao.setVisible(true);
            this.icon_piao.initWithFile("res/res_sdh/imgPiao/icon_piao_" + num + ".png");
        }else{
            this.icon_piao.setVisible(false);
        }
    },

    setPosWithIdx:function(idx){
        this._super(idx);

        if(idx == 0){
            this.icon_piao.setPosition(45,-30);
        }else if(idx == 1){
            this.icon_piao.setPosition(-45,-30);
        }else if(idx == 2){
            this.icon_piao.setPosition(-45,-30);
        }else if(idx == 3){
            this.icon_piao.setPosition(45,-30);
        }
    },

    cleanData:function(){
        this._super();

        this.icon_piao.setVisible(false);
    },

});

