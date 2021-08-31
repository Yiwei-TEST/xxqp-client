/**
 * Created by cyp on 2019/12/27.
 */
var XTBPOptBtnLayer = SDHOptBtnLayer.extend({

    initLayer:function(){
        this._super();

        this.content_piao = new cc.Node();
        this.contentNode.addChild(this.content_piao);

        var itemW = 300;
        for(var i = 0;i<4;++i){
            var img = "res/res_sdh/imgPiao/btn_piao_" + i + ".png";
            var btn = new ccui.Button(img,img);
            btn.flag = i;
            btn.setPosition((i-1.5)*itemW,0);
            this.content_piao.addChild(btn);
            btn.addTouchEventListener(this.onClickPiaoBtn,this);

        }

        this.content_piao.setVisible(false);

        var img = "res/res_sdh/btn_tx_2.png";
        this.btn_tx_2 = new ccui.Button(img,img,"");
        this.btn_tx_2.addTouchEventListener(this.onClickBtn,this);
        this.contentNode.addChild(this.btn_tx_2);

        var img = "res/res_sdh/btn_tx_1.png";
        this.btn_touxiang.loadTextures(img,img,"");

        this.btn_touxiang.setScale(0.9);
        this.btn_tx_2.setScale(0.9);
        this.btn_maipai.setScale(0.9);

        this.btn_maipai.setPositionX(375);
        this.btn_touxiang.setPositionX(-375);

    },

    setTouXiangState:function(){
        if(SDHRoomModel.intParams[21] == 1){
            var img = "res/res_sdh/tx.png";
            this.btn_tx_2.loadTextures(img,img,"");

            this.btn_tx_2.setScale(1);
            this.btn_maipai.setScale(1);

            this.btn_maipai.setPositionX(300);
            this.btn_tx_2.setPositionX(-300);

        }else{
            var img = "res/res_sdh/btn_tx_2.png";
            this.btn_tx_2.loadTextures(img,img,"");

            this.btn_tx_2.setScale(0.9);
            this.btn_maipai.setScale(0.9);

            this.btn_maipai.setPositionX(375);
            this.btn_tx_2.setPositionX(0);
        }
    },

    setBtnState:function(type){
        this._super(type);

        this.btn_tx_2.setVisible(type == 2);

        if(SDHRoomModel.intParams[21] == 1){
            this.btn_touxiang.setVisible(false);
        }
    },

    handleTableData:function(type,data){
        this._super(type,data);

        if(type == SDHTabelType.CreateTable){
            this.content_piao.setVisible(false);
            this.setTouXiangState();
            if(SDHRoomModel.remain == 8){
                var p = SDHRoomModel.getPlayerDataByItem("seat",SDHRoomModel.mySeat);
                if(p && p.ext[6] == -1){
                    this.content_piao.setVisible(true);
                }
            }

        }else if(type == "PiaoFen"){
            if(data.params[0] == 0){
                this.content_piao.setVisible(true);
            }else {
                var temp = JSON.parse(data.strParams[0]);
                if(temp.seat == SDHRoomModel.mySeat){
                    this.content_piao.setVisible(false);
                }
            }
        }
    },

    setClockState:function(){
        this._super();
        var seq = SDHRoomModel.getSeqWithSeat(SDHRoomModel.nextSeat);
        if(seq == 1 && SDHRoomModel.remain == 3){
            this.spr_clock.y += 150;
        }
    },

    onClickBtn:function(sender,type){
        this._super(sender,type);

        if(type == ccui.Widget.TOUCH_ENDED){
            if(sender == this.btn_tx_2){
                sySocket.sendComReqMsg(3105,[4]);
            }
        }
    },

    onClickPiaoBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            sySocket.sendComReqMsg(3117,[sender.flag]);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

});