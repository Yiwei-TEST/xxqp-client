/**
 * Created by cyp on 2019/3/12.
 */
var ShopPop = BasePopup.extend({
    ctor:function(shopType){
        this.shopType = shopType || 1
        this.kfwxStr = "----";

        if(sy.kefuWxData){
            this.kfwxStr = sy.kefuWxData[0];
        }

        this.payChannelData = [];
        this.payTypeNum = 3;

        this.shop_type_1 = 1;
        this.shop_type_2 = 2;
        this.shop_type_3 = 3;
        this._super("res/shopPop.json");
    },

    selfRender:function(){
        //var shopItem = this.getWidget("shop_item");
        //shopItem.setVisible(false);
        this.addCustomEvent(SyEvent.GOLD_EXCHANGE_LIST,this,this.onGoldExchangeList);

        for(var i = 1; i<=this.payTypeNum; i++){
            this["btn_shop_"+i] = this.getWidget("btn_shop_"+i)
            UITools.addClickEvent(this["btn_shop_"+i],this,this.onBtnClick);
            this["Panel_shop_"+i] = this.getWidget("Panel_shop_"+i)
            this["Panel_shop_"+i].setVisible(false);
            ccui.helper.seekWidgetByName(this["Panel_shop_"+i],"shop_item").visible = false;
        }
        this.onBtnClick(this["btn_shop_"+this.shopType])

        this.label_zsNum = this.getWidget("money_num");
        this.label_zsNum.setString(PlayerModel.cards);
        this.label_goldNum = this.getWidget("gold_num");
        this.label_goldNum.setString(UITools.moneyToStr(PlayerModel.getCoin()));

        this.getWidget("btn_dh").setVisible(false);

        this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE,this,this.onPlayerUpdate);
        this.addCustomEvent("sy_finish_select_pay_type",this,this.onSelectPayType);

        //this.itemScroll = this.getWidget("itemScroll");
        //this.itemScroll_gmjb = this.getWidget("itemScroll_gmjb");
        this.panel_no_daili = this.getWidget("panel_no_daili");
        this.btn_copy = this.getWidget("btn_copy");

        var label_info = this.getWidget("label_info");
        label_info.setString("成为代理请联系客服微信:" + this.kfwxStr);

        UITools.addClickEvent(this.btn_copy,this,this.onClickCopyBtn);

        //this.itemScroll.setVisible(false);
        //this.itemScroll_gmjb.setVisible(false);
        this.panel_no_daili.setVisible(false);

        this.getPlayerDailiState();
        this.getPayChannel();
    },

    onBtnClick:function(sender){
        for(var i = 1;i<=this.payTypeNum;i++){
            this["btn_shop_"+i].setBright(sender == this["btn_shop_"+i]?true:false)
            this["Panel_shop_"+i].setVisible(sender == this["btn_shop_"+i]?true:false)
        }
    },

    onClickCopyBtn:function(){
        SdkUtil.sdkPaste(this.kfwxStr);
        FloatLabelUtil.comText("复制成功");
    },

    onGoldExchangeList:function(event){
        var data = event.getUserData();
        var exchangeList = JSON.parse(data[1])
        this.updateShopList(exchangeList,3)
    },

    updateShopList:function(shopArr,type){
        var itemScroll = this.getWidget("Panel_shop_"+type);
        var shopItem = itemScroll.getChildByName("shop_item");
        var itemLine = itemScroll.getChildByName("img_line");

        var spaceH = 450;
        var contentH = Math.max(itemScroll.height,spaceH * Math.ceil(shopArr.length/3));
        itemScroll.setInnerContainerSize(cc.size(itemScroll.width,contentH));

        for(var i = 0;i<shopArr.length;++i){
            var item = shopItem;
            if(i>0){
                item = shopItem.clone();
                itemScroll.addChild(item);
            }
            item.setVisible(true);
            item.x = item.x + i%3*480;
            item.y = contentH - (parseInt(i/3)+0.5)*450;
            if(type == this.shop_type_1){
                this.setDiamondItem(item,shopArr[i],i)
            }else if(type == this.shop_type_2){
                //this.setCoinItem(item,shopArr[i],i)
            }else if(type == this.shop_type_3){
                this.setExchangeItem(item,shopArr[i],i)
            }

            if(i%3==0){
                if(i ==0){
                    itemLine.y = item.y + 240;
                }else{
                    var line = itemLine.clone();
                    line.y = item.y + 240;
                    itemScroll.addChild(line);
                }
            }
        }
    },

    setDiamondItem:function(item,data,index){
        item.getChildByName("item_name").setString(data.name);
        var buyBtn = item.getChildByName("btn_buy");
        buyBtn.price = data.fee;
        UITools.addClickEvent(buyBtn,this,this.onClickBuyBtn);
        buyBtn.getChildByName("item_fee").setString("￥" + data.fee);
        buyBtn.tempData = index+1;
    },

    setCoinItem:function(item,data,index){
        item.getChildByName("item_name").setString(data.gold_coins);

        var send_coin = item.getChildByName("Label_send_coin")
        send_coin.setString("多送"+data.send_gold_coins)

        var bg_send_coin = item.getChildByName("Image_bg_send_coin")
        bg_send_coin.width = send_coin.width+20

        var Label_desc = item.getChildByName("Label_desc")
        Label_desc.setString(""+data.desc)

        var item_icon = item.getChildByName("item_icon")
        item_icon.loadTexture("res/ui/bjdmj/popup/shop/"+data.client_pic)

        var buyBtn = item.getChildByName("btn_buy");
        UITools.addClickEvent(buyBtn,this,this.onClickCoinBuyBtn);
        buyBtn.getChildByName("item_fee").setString(data.cards);
        buyBtn.tempData = index+1;
    },
    setExchangeItem:function(item,data,index){
        item.getChildByName("item_name").setString(data.count);
        var buyBtn = item.getChildByName("btn_buy");
        buyBtn.price = data.id;
        UITools.addClickEvent(buyBtn,this,this.onClickExchangeBtn);
        buyBtn.getChildByName("item_fee").setString(data.amount);
        item.getChildByName("item_icon").loadTexture("res/res_gold/shopPop/shop_gold_"+(index+1)+".png")
    },

    onClickExchangeBtn:function(obj){
        var itemId = obj.price
        if(Number(itemId) > PlayerModel.cards){
            FloatLabelUtil.comText("钻石不足");
            this.onBtnClick(this["btn_shop_1"])
        }else{
            sySocket.sendComReqMsg(906 , [1,Number(itemId)] , [] , 2);
        }
    },

    getCoinData:function(){
        var url = "http://bjdqp.firstmjq.club/agent/player/exchangeShow/wx_plat/mjqz"
        var self = this;
        Network.sypost(url,"",{type:"GET"},function(data){
            self.updateShopList(self.handleCoinData(data),self.shop_type_2)
        },function(data){
        });
    },

    getShopData:function(level){
        var url = SdkUtil.COMMON_HTTP_URL + "/pay/mjqpayu333/goods?level=" + level;
        var self = this;
        sy.scene.showLoading("正在获取商品数据");
        Network.sypost(url,"getGoods",{type:"GET","level":level},function(data){
            sy.scene.hideLoading();
            cc.log("=========getShopData=========" + JSON.stringify(data));
            self.updateShopList(self.handleShopData(data),self.shop_type_1);
        },function(data){
            sy.scene.hideLoading();
        });
    },

    handleCoinData:function(data){
        var retData = [];
        if(data && data.data){
            for(var key in data.data){
                cc.log("handleCoinData",JSON.stringify(key),JSON.stringify(data.data[key]))
                var itemData = {};
                itemData.id = data.data[key].id;
                itemData.gold_coins = data.data[key].gold_coins+"金币";
                itemData.send_gold_coins = data.data[key].send_gold_coins;
                itemData.cards = data.data[key].cards;
                itemData.client_pic = data.data[key].client_pic;
                itemData.desc = data.data[key].desc;
                retData.push(itemData);
            }
        }
        return retData;
    },

    getCoinPayOrder:function(id){
        sy.scene.showLoading("正在获取商品数据");
        var char_id = "char_id=" + PlayerModel.userId;
        var _nowTime = Math.round(new Date().getTime()/1000).toString();
        var t = "&t=" + _nowTime;
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t +"dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+ md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/player/exchangeGoldCoins/wx_plat/mjqz?id="+ id+"&"
        url = url + char_id + t + rand +sign
        Network.sypost(url,"",{type:"GET"},function(data){
            cc.log(JSON.stringify(data))
            FloatLabelUtil.comText(data.msg);
            sy.scene.hideLoading();
        }, function(data){
            cc.log(JSON.stringify(data))
            FloatLabelUtil.comText(data.msg);
            sy.scene.hideLoading();
        })
    },

    //获取支付订单
    getPayOrder:function(price,pay_code,userId){
        var self = this;

        if (SyConfig.IS_WX_PAY && pay_code == 12) {
            var params = {price: price, account: userId || PlayerModel.userId};
            Network.sypost(SdkUtil.COMMON_HTTP_URL + "/pay/mjqpay51zpay/wxPay","getPayOrder", params,function(data){
                sy.scene.hideLoading();
                if (data.code == 0) {
                    if (SyConfig.isAndroid()) {
                        jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkPay", "(Ljava/lang/String;)V", JSON.stringify(data));
                    }
                    else {
                        ios_sdk_wxpay(JSON.stringify(data));
                    }
                }
            }, function(data){
                FloatLabelUtil.comText(data.msg);
                sy.scene.hideLoading();
            });
        }
        else {
            var appId = 4962;
            if (SyConfig.isIos()) {
                appId = 4963;
            }

            var params = {pay_code: 12, price: price, app_id: appId, account: userId || PlayerModel.userId};
            if (pay_code) {
                params.pay_code = pay_code;
            }

            sy.scene.showLoading("正在生成订单");

            Network.sypost(SdkUtil.COMMON_HTTP_URL + "/pay/mjqpay51zpay/pay", "getPayOrder", params, function(data) {
                sy.scene.hideLoading();
                if (data.code == 0) {
                    if(params.pay_code == 2) {
                        SdkUtil.sdkOpenUrl(data.data.alipay_url);
                    }
                    else if (params.pay_code == 5) {
                        self.wx_gzh_pay(data.data.wxpay_url,price,params.account);
                    }
                    else {
                        if(SyConfig.isIos()){
                            SdkUtil.sdkOpenUrl(data.data.ios_url);
                        } else {
                            jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkbjdPay", "(Ljava/lang/String;)V", JSON.stringify(data.data.android_data));
                        }
                    }
                }
            }, function(data){
                FloatLabelUtil.comText(data.msg);
                sy.scene.hideLoading();
            });
        }
    },

    //微信公众号分享支付链接
    wx_gzh_pay:function(wxpay_url,price,userId){
        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=wxpay_url;
        var content = "点击链接为游戏ID:" + userId + "的玩家购买钻石完成支付,支付价格:" + price + "元";
        obj.title="点击链接完成支付";
        obj.pyq=content;
        obj.description=content;
        obj.shareType=1;
        obj.session = 0;
        SdkUtil.sdkFeed(obj,true);
    },

    //签名不一样，不用通用的网络接口了
    getPlayerDailiState:function(){
        var char_id = PlayerModel.userId;
        var time = new Date().getTime();
        var sign = "" + char_id + time;
        sign = md5(sign);

        var url = SdkUtil.COMMON_HTTP_URL + "/agent/player/isAgent/wx_plat/mjqz";
        url += ("?char_id=" + char_id);
        url += ("&time=" + time);
        url += ("&sign=" + sign);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getPlayerDailiState========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getPlayerDailiState============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);

                    //if(data.code == 1){//是代理
                    for(var i = 1;i <= this.payTypeNum;i++){
                        self["Panel_shop_"+i].setVisible(true);
                    }
                    self.panel_no_daili.setVisible(false);
                    self.getShopData(data.code == 1?1:-1);
                    sySocket.sendComReqMsg(906 , [1] , [] , 1);// 获取兑换列表,int[0]=type 1钻石换金币，2金币换钻石
                    //}else{
                    //self.itemScroll.setVisible(false);
                    //self.panel_no_daili.setVisible(true);
                    //}
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();

    },

    //获取可用支付渠道
    /**
     pay code: mjq_51zpay 目前可用的是 2,5,12
     * 1 微信 H5
     * 2 支付宝 H5
     * 3 银联 H5
     * 4 微信扫码
     * 5 微信公众号
     * 6 QQ 钱包
     * 7 QQ 钱包公众号
     * 8 支付宝扫码
     * 9 京东 WAP
     * 10 京东扫码
     * 11 QQ 钱包扫码
     * 12 微信 wxa
     **/
    getPayChannel:function(){
        var self = this;

        var appId = 4962;
        if(SyConfig.isIos()){
            appId = 4963;
        }
        var params = {app_id:appId};

        Network.sypost(SdkUtil.COMMON_HTTP_URL + "/pay/Mjqpay51zpay/channel","channel",params,function(data){
            sy.scene.hideLoading();
            cc.log("=========getPayChannel=========" + JSON.stringify(data));
            if (data.code == 0) {
                self.payChannelData = data.data;
            }
        },function(data){
            FloatLabelUtil.comText(data.msg);
        });
    },

    handleShopData:function(data){
        var retData = [];
        if(data && data.data){
            for(var key in data.data){
                var itemData = {};
                itemData.name = key + "钻石";
                itemData.fee = parseInt(data.data[key]);
                retData.push(itemData);
            }
        }
        return retData;
    },

    onClickBuyBtn:function(sender){
        cc.log("===============onClickBuyBtn=================" + sender.price);
        if(PlayerModel.payBindId){
            var pop = new PayTypeSelect(sender.price,this.payChannelData);
            PopupManager.addPopup(pop);
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },

    onClickCoinBuyBtn:function(sender){
        if(PlayerModel.payBindId){
            this.getCoinPayOrder(sender.tempData)
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },

    onSelectPayType:function(event){
        var data = event.getUserData();
        this.getPayOrder(data.price,data.pay_code,data.userId);
    },

    onPlayerUpdate:function(){
        this.label_zsNum.setString(PlayerModel.cards);
        this.label_goldNum.setString(UITools.moneyToStr(PlayerModel.getCoin()));
    },
});

var PayTypeSelect = BasePopup.extend({
    ctor:function(price,payChannelData){

        this.price = price;
        this.payChannelData = payChannelData || [];
        this.cur_pay_code = 0;

        this._super("res/payTypeSelectPop.json");
    },

    selfRender:function(){
        this.btnTrue = this.getWidget("btnTrue");
        this.btn_wx_pay = this.getWidget("btn_wx_pay");
        this.btn_alipay = this.getWidget("btn_alipay");

        var inputBg = this.getWidget("input_bg");

        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 30, 60),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setPlaceholderFont("Arial",36);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setPlaceHolder("请输入玩家ID");
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("Arial",36);

        this.inputBox.setString(PlayerModel.userId + "");

        this.label_tip = this.getWidget("label_tip");

        UITools.addClickEvent(this.btn_alipay,this,this.onClickAliPay);
        UITools.addClickEvent(this.btn_wx_pay,this,this.onClickWxPay);
        UITools.addClickEvent(this.btnTrue,this,this.onClickTrueBtn);

        this.setPayBtnState();
        this.setBtnSelect();
    },

    setPayBtnState:function(){
        this.btn_wx_pay.setBright(false);
        this.btn_alipay.setBright(false);
        this.btn_wx_pay.setTouchEnabled(false);
        this.btn_alipay.setTouchEnabled(false);
        for(var i = 0;i<this.payChannelData.length;++i){
            if(this.payChannelData[i].pay_code == 12 || this.payChannelData[i].pay_code == 5){
                this.btn_wx_pay.setBright(true);
                this.btn_wx_pay.setTouchEnabled(true);
                this.cur_pay_code = this.btn_wx_pay.pay_code = this.payChannelData[i].pay_code;
            }
            if(this.payChannelData[i].pay_code == 2){
                this.btn_alipay.setBright(true);
                this.btn_alipay.setTouchEnabled(true);
                this.cur_pay_code = this.btn_alipay.pay_code = this.payChannelData[i].pay_code;
            }
        }
    },

    onClickAliPay:function(sender){
        this.cur_pay_code = sender.pay_code;
        this.setBtnSelect();
    },

    onClickWxPay:function(sender){
        this.cur_pay_code = sender.pay_code;
        this.setBtnSelect();
    },

    onClickTrueBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(this.cur_pay_code == 0){
            FloatLabelUtil.comText("暂无可用支付渠道");
            return;
        }

        SyEventManager.dispatchEvent("sy_finish_select_pay_type",{pay_code:this.cur_pay_code,userId:this.inputBox.getString(),price:this.price});
    },

    setBtnSelect:function(){
        this.btn_wx_pay.getChildByName("img_select").setVisible(this.cur_pay_code == 12 || this.cur_pay_code == 5);
        this.btn_alipay.getChildByName("img_select").setVisible(this.cur_pay_code == 2);

        var tipStr = "分享支付链接至微信\n微信点击链接完成支付";
        this.label_tip.setString(this.cur_pay_code == 5?tipStr:"");
    },
});
