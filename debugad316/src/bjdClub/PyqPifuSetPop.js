/**
 * Created by cyp on 2020/1/7.
 */
var PyqPifuSetPop = cc.Layer.extend({
    ctor:function(bagsData){
        this._super();

        this.bagsData = bagsData || [];

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){
                var rect = cc.rect(0,0,this.layerBg.width,this.layerBg.height);
                var pos = this.layerBg.convertTouchToNodeSpace(touch);
                if(!cc.rectContainsPoint(rect,pos)){
                    PopupManager.remove(this);
                    return true;
                }
            }.bind(this)
        }),this);

        this.bgType = ClickClubModel.bgType;
        this.curOptWanfa = null;

        this.initLayer();
    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(120);
        this.addChild(gray);

        var bg = new cc.Sprite("res/ui/bjdmj/popup/pyq/pifu/layerbg.png");
        bg.setPosition(cc.winSize.width - bg.width/2,cc.winSize.height/2);
        this.addChild(bg);

        this.layerBg = bg;

        this.bg_scroll = new ccui.ScrollView();
        this.bg_scroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.bg_scroll.setContentSize(bg.width - 150,150);
        this.bg_scroll.setPosition(105,bg.height - 240);
        bg.addChild(this.bg_scroll);

        var itemW = 240;

        this.bg_scroll.setInnerContainerSize(cc.size(itemW*8,this.bg_scroll.height));

        this.bgItemArr = [];
        for(var i = 0;i<8;++i){
            var img = "res/ui/bjdmj/popup/pyq/pifu/set_bg_" + (i + 1) + ".png";
            var item = new ccui.Button(img,img,"");
            item.flag = i+1;
            item.setPosition(itemW*(i+0.5),this.bg_scroll.height/2);
            item.addTouchEventListener(this.onClickBg,this);
            this.bg_scroll.addChild(item);
            this.bgItemArr.push(item);
        }

        this.bgKuang = new cc.Sprite("res/ui/bjdmj/popup/pyq/pifu/kuang_1.png");
        this.bgKuang.setPosition(this.bgItemArr[0].getPosition());
        this.bg_scroll.addChild(this.bgKuang);

        this.setSelectBg(this.bgType,1);

        this.wanfa_scroll = new ccui.ScrollView();
        this.wanfa_scroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.wanfa_scroll.setContentSize(bg.width - 150,210);
        this.wanfa_scroll.setPosition(this.bg_scroll.x,this.bg_scroll.y - 233);
        bg.addChild(this.wanfa_scroll);

        this.wanfaKuang = new cc.Sprite("res/ui/bjdmj/popup/pyq/pifu/kuang_2.png");
        this.wanfa_scroll.addChild(this.wanfaKuang);

        this.zhuo_scroll = new ccui.ScrollView();
        this.zhuo_scroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.zhuo_scroll.setContentSize(bg.width - 150,210);
        this.zhuo_scroll.setPosition(this.bg_scroll.x,this.wanfa_scroll.y - 225);
        bg.addChild(this.zhuo_scroll);


        this.zhuoKuang = new cc.Sprite("res/ui/bjdmj/popup/pyq/pifu/kuang_3.png");
        this.zhuo_scroll.addChild(this.zhuoKuang);

        var itemW = 240;
        this.zhuoArr = [];
        for(var i = 0;i<3;++i){
            var img = "res/ui/bjdmj/popup/pyq/pifu/set_zhuozi_" + (i + 1) + ".png";
            var item = new ccui.Button(img,img,"");
            item.flag = i+1;
            item.setPosition(itemW*(i+0.5),this.zhuo_scroll.height/2);
            item.addTouchEventListener(this.onClickZhuoZi,this);
            this.zhuo_scroll.addChild(item);
            this.zhuoArr.push(item);

            if(i == 0){
                this.zhuoKuang.setPosition(item.getPosition());
            }
        }

        this.bu_scroll = new ccui.ScrollView();
        this.bu_scroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.bu_scroll.setContentSize(bg.width - 120,210);
        this.bu_scroll.setPosition(this.bg_scroll.x,this.zhuo_scroll.y - 222);
        bg.addChild(this.bu_scroll);


        this.buKuang = new cc.Sprite("res/ui/bjdmj/popup/pyq/pifu/kuang_4.png");
        this.bu_scroll.addChild(this.buKuang);

        var itemW = 150;
        this.buArr = [];
        for(var i = 0;i<10;++i){
            var img = "res/ui/bjdmj/popup/pyq/pifu/zhuobu_" + (i) + ".png";
            var item = new ccui.Button(img,img,"");
            item.flag = i;
            item.setPosition((Math.floor(i/2) + 0.5)*itemW,this.bu_scroll.height/2 - (i%2*2 - 1)*53);
            item.addTouchEventListener(this.onClickZhuoBu,this);
            this.bu_scroll.addChild(item);
            this.buArr.push(item);

            if(i == 0){
                this.buKuang.setPosition(item.getPosition());
            }
        }

        this.addWanfaItem(this.bagsData);

        var img = "res/ui/bjdmj/popup/pyq/pifu/btn_queding.png";
        this.btn_sure = new ccui.Button(img,img);
        this.btn_sure.setPosition(bg.width/2,75);
        this.btn_sure.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_sure);

    },

    addWanfaItem:function(data){
        var itemW = 330;
        this.wanfa_scroll.setInnerContainerSize(cc.size(Math.max(itemW*Math.ceil(data.length/2),this.wanfa_scroll.width),this.wanfa_scroll.height));

        this.bagItemArr = [];
        for(var i = 0;i<data.length;++i){
            var img1 = "res/ui/bjdmj/popup/pyq/pifu/img_item1.png";
            var img2 = "res/ui/bjdmj/popup/pyq/pifu/img_item2.png";
            var item = new ccui.Button(img1,img1,img2);
            item.setBright(false);
            item.setPosition((Math.floor(i/2) + 0.5)*itemW,this.wanfa_scroll.height/2 - (i%2*2 - 1)*53);
            item.addTouchEventListener(this.onClickWanfa,this);
            this.wanfa_scroll.addChild(item);

            item.keyId = data[i].keyId;
            this.bagItemArr.push(item);

            var label_name = UICtor.cLabel((i+1) + " " + data[i].groupName,33);
            label_name.setAnchorPoint(0,0.5);
            label_name.setTag(1);
            label_name.setColor(cc.color(103,61,62));
            label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            label_name.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            label_name.setTextAreaSize(cc.size(200,38));
            label_name.setPosition(10,item.height/2);
            item.addChild(label_name);

            var img_zhuo = new cc.Sprite("res/ui/bjdmj/popup/pyq/zhuobu/zhuo_1_4.png");
            img_zhuo.setPosition(item.width - 45,item.height/2);
            img_zhuo.setScale(0.2);
            img_zhuo.setTag(2);
            item.addChild(img_zhuo);

            var img_bu = new cc.Sprite("res/ui/bjdmj/popup/pyq/zhuobu/bu_1_0.png");
            img_bu.setPosition(img_zhuo.x,img_zhuo.y + 12);
            img_bu.setScale(0.2);
            img_bu.setTag(3);
            item.addChild(img_bu);

            var temp1 = 1;
            var temp2 = 0;

            if(data[i].extMsg){
                var extMsg = JSON.parse(data[i].extMsg);
                temp1 = extMsg[1];
                temp2 = extMsg[2];
            }else{
                var wanfa = data[i].config.modeMsg.split(",")[1];
                if(GameTypeManager.isPK(wanfa)){
                    temp2 = 1;//扑克
                }else if(GameTypeManager.isZP(wanfa)){
                    temp2 = 9;//字牌
                }
            }

            this.setItemZhuoZi(item,temp1);
            this.setItemZhuoBu(item,temp2);

            item.flag = item.ZhuoType*10 + item.buType;

            if(i == 0){
                this.setSelectWanfa(item);
            }
        }
    },

    getBagSetData:function(){
        var cfgArr = [];
        for(var i = 0;i<this.bagItemArr.length;++i){
            var item = this.bagItemArr[i];
            if(item.flag != (item.ZhuoType*10 + item.buType)){
                cfgArr.push(item.keyId + "," + item.ZhuoType + "," + item.buType);
            }
        }
        return cfgArr.join(";");
    },

    setItemZhuoZi:function(item,type){
        var img = "res/ui/bjdmj/popup/pyq/zhuobu/zhuo_" + type + "_4.png";
        item.getChildByTag(2).initWithFile(img);
        item.ZhuoType = type;
    },

    setItemZhuoBu:function(item,type){
        var img = "res/ui/bjdmj/popup/pyq/zhuobu/bu_" + item.ZhuoType + "_" + type + ".png";
        item.getChildByTag(3).initWithFile(img);
        item.buType = type;
    },

    setSelectWanfa:function(item){
        var color1 = cc.color(208,19,27);
        var color2 = cc.color(103,61,62);
        if(this.curOptWanfa){
            this.curOptWanfa.setBright(false);
            this.curOptWanfa.getChildByTag(1).setColor(color2);
        }
        item.getChildByTag(1).setColor(color1);
        item.setBright(true);
        this.wanfaKuang.setPosition(item.getPosition());
        this.curOptWanfa = item;

        this.zhuoKuang.setPosition(this.zhuoArr[item.ZhuoType-1].getPosition());
        this.buKuang.setPosition(this.buArr[item.buType].getPosition());
    },

    setSelectBg:function(type,tip){
        if(this.bgItemArr[type - 1]){
            this.bgType = type;
            this.bgKuang.setPosition(this.bgItemArr[type-1].getPosition());

            if(tip == 1){
                var persent = (type-1)/(this.bgItemArr.length-1)*100;
                this.bg_scroll.jumpToPercentHorizontal(persent);
            }
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_sure){

                var bagSetData = this.getBagSetData();
                var params = {optType:101};

                if(this.bgType != ClickClubModel.bgType){
                    params.backGround = this.bgType;
                }
                if(bagSetData)params.configs = bagSetData;

                if(this.bgType != ClickClubModel.bgType || bagSetData){
                    this.sendConfig(params);
                }else{
                    PopupManager.remove(this);
                }
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickBg:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            this.setSelectBg(sender.flag);
            SyEventManager.dispatchEvent("Change_Club_Bg",sender.flag);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickWanfa:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            this.setSelectWanfa(sender);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickZhuoZi:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            this.zhuoKuang.setPosition(sender.getPosition());

            if(this.curOptWanfa){
                this.setItemZhuoZi(this.curOptWanfa,sender.flag);
                this.setItemZhuoBu(this.curOptWanfa,this.curOptWanfa.buType);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickZhuoBu:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            this.buKuang.setPosition(sender.getPosition());

            if(this.curOptWanfa){
                this.setItemZhuoBu(this.curOptWanfa,sender.flag);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    sendConfig:function(params){

        params = params || {};
        params.keyId = ClickClubModel.getCurClubKeyId();
        params.groupId = ClickClubModel.getCurClubId();
        params.userId = PlayerModel.userId;
        params.sessCode = PlayerModel.sessCode;

        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupInfo",params, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);

                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
                PopupManager.remove(self);

            }
        }, function (data) {
            var str = "修改失败";
            if(data && data.message){
                str = data.message;
            }
            FloatLabelUtil.comText(str);
        });
    },

    onClose : function(){
        cc.sys.localStorage.setItem("sy_club_bg_type",this.bgType);
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});