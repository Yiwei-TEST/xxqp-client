/**
 * Created by cyp on 2019/11/13.
 */
var TCGDMenuBtnLayer = cc.Layer.extend({
    isHide:true,
    ctor:function(){
        this._super();

        this.initLayer();

    },

    initLayer:function(){
        this.layerBg = new cc.Scale9Sprite("res/res_tcgd/caidanxiala.png");
        this.layerBg.setAnchorPoint(0,1);
        this.layerBg.setPosition(30,cc.winSize.height - 135);
        this.addChild(this.layerBg);

        var btnArr = [];

        var img = "res/res_tcgd/jsfj.png";
        this.btn_jsfj = new ccui.Button(img,img);
        this.layerBg.addChild(this.btn_jsfj);
        btnArr.push(this.btn_jsfj);

        var img = "res/res_tcgd/tc.png";
        this.btn_tc = new ccui.Button(img,img);
        this.layerBg.addChild(this.btn_tc);
        btnArr.push(this.btn_tc);

        var img = "res/res_tcgd/sz.png";
        this.btn_sz = new ccui.Button(img,img);
        this.layerBg.addChild(this.btn_sz);
        btnArr.push(this.btn_sz);

        this.layerBg.setContentSize(this.layerBg.width,btnArr.length*110);
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].setPosition(btnArr[i].width/2,this.layerBg.height - (i+0.5)*110 - 3);
            btnArr[i].addTouchEventListener(this.onClickBtn,this);
        }

        this.layerBg.setScaleY(0);
        this.layerBg.visible = false;

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_jsfj){
                AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
                    sySocket.sendComReqMsg(7);
                });
            }else if(sender == this.btn_tc){
                sySocket.sendComReqMsg(6);
            }else if(sender == this.btn_sz){
                var mc = new TCGDSetUpPop();
                PopupManager.addPopup(mc);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    changeState:function(){
        var action = cc.sequence(cc.show(),cc.scaleTo(0.2,1,1));
        if(!this.isHide){
            action = cc.sequence(cc.scaleTo(0.2,1,0),cc.hide());
        }
        this.layerBg.stopAllActions();
        this.layerBg.runAction(action);
        this.isHide = !this.isHide;
    },


})

