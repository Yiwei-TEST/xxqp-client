/**
 * Created by cyp on 2020/1/8.
 */
var PyqSetOrderLayer = cc.Layer.extend({
    ctor:function(bagsData){
        this._super();

        this.bagsData = bagsData || [];

        this.initLayer();
        this.addBagItems(this.bagsData);
    },

    onTouchBegan:function(touch,event){

        var rect = cc.rect(0,0,this.itemScroll.width,this.itemScroll.height);
        var pos = this.itemScroll.convertTouchToNodeSpace(touch);
        if(!cc.rectContainsPoint(rect,pos)){
            return false;
        }

        if(this.curOptItem){
            this.curOptItem.setLocalZOrder(1);
            this.curOptItem = null;
        }
        for(var i = 0;i<this.wanfaItems.length;++i){
            var item = this.wanfaItems[i];
            var rect = cc.rect(0,0,item.width,item.height);
            var pos = item.convertTouchToNodeSpace(touch);
            if(cc.rectContainsPoint(rect,pos)){
                this.curOptItem = item;
                break;
            }
        }

        if(this.curOptItem){
            this.curOptItem.setLocalZOrder(10);
            return true;
        }
        return false;
    },

    onTouchMoved:function(touch,event){
        if(this.curOptItem){
            var delt = touch.getDelta();
            this.curOptItem.setPosition(this.curOptItem.x + delt.x,this.curOptItem.y + delt.y);
        }
    },

    onTouchEnded:function(touch,event){
        if(this.curOptItem){
            var idx = -1;
            for(var i = 0;i<this.posArr.length;++i) {
                var pos = this.posArr[i];
                if((Math.abs(pos.x - this.curOptItem.x) < this.itemW/2) && (Math.abs(pos.y - this.curOptItem.y) < this.itemH/2)){
                    idx = i;
                    break;
                }
            }
            if(idx >= 0 && idx != this.curOptItem.flag){
                this.switchItem(this.curOptItem,this.wanfaItems[idx]);
            }else{
                this.curOptItem.runAction(cc.moveTo(0.1,this.posArr[this.curOptItem.flag]));
            }
        }
    },

    switchItem:function(item1,item2){
        var idx1 = item1.flag;
        var idx2 = item2.flag;


        if(idx1 < idx2){
            for(var i = idx1 + 1;i<=idx2;++i){
                var item = this.wanfaItems[i];
                item.flag = i-1;
                item.getChildByTag(1).setString(item.flag + 1);
                item.runAction(cc.moveTo(0.1,this.posArr[item.flag]));
                this.wanfaItems[item.flag] = item;
            }
        }else{
            for(var i = idx1 - 1;i>=idx2;--i){
                var item = this.wanfaItems[i];
                item.flag = i+1;
                item.getChildByTag(1).setString(item.flag + 1);
                item.runAction(cc.moveTo(0.1,this.posArr[item.flag]));
                this.wanfaItems[item.flag] = item;
            }
        }
        item1.flag = idx2;
        item1.getChildByTag(1).setString(idx2 + 1);
        item1.runAction(cc.moveTo(0.1,this.posArr[idx2]));
        this.wanfaItems[idx2] = item1;


        // item1.flag = idx2;item2.flag = idx1;
        //
        // item1.getChildByTag(1).setString(idx2 + 1);
        // item2.getChildByTag(1).setString(idx1 + 1);
        //
        // item1.runAction(cc.moveTo(0.1,this.posArr[idx2]));
        // item2.runAction(cc.moveTo(0.1,this.posArr[idx1]));
        //
        // this.wanfaItems[idx1] = item2;
        // this.wanfaItems[idx2] = item1;

    },

    initLayer:function(){
        var bg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/di1.png");
        bg.setContentSize(cc.winSize);
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        var img = "res/ui/bjdmj/popup/x.png";
        var btn_close = new ccui.Button(img,img);
        btn_close.setPosition(bg.width - 60,bg.height - 60);
        btn_close.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(btn_close);

        this.btn_close = btn_close;

        var bg2 = new cc.Scale9Sprite("res/ui/bjdmj/popup/dadi1.png");
        bg2.setContentSize(bg.width - 30,bg.height - 300);
        bg2.setPosition(bg.width/2,bg.height/2 + 45);
        bg.addChild(bg2);

        this.itemScroll = new ccui.ScrollView();
        this.itemScroll.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.itemScroll.setContentSize(bg2.getContentSize());
        this.itemScroll.setPosition(0,0);
        bg2.addChild(this.itemScroll);

        var node = new cc.Node();
        bg2.addChild(node,1);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved:this.onTouchMoved.bind(this),
            onTouchEnded:this.onTouchEnded.bind(this)
        }),node);

        var title = new ccui.Text("玩法排序","res/font/bjdmj/fzcy.TTF",60);
        title.setPosition(bg.width/2,bg.height - 60);
        title.setColor(cc.color("#9c7966"));
        bg.addChild(title);

        img = "res/ui/bjdmj/popup/yqh/queding.png";
        this.btn_queding = new ccui.Button(img,img);
        this.btn_queding.setPosition(bg.width/2 + 300,105);
        this.btn_queding.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_queding);

        img = "res/ui/bjdmj/popup/yqh/quxiao.png";
        this.btn_quxiao = new ccui.Button(img,img);
        this.btn_quxiao.setPosition(bg.width/2 - 300,105);
        this.btn_quxiao.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_quxiao);

        var str = "拖动玩法条块到相应\n位置实现排序调整\n深色底空白处可滑动滚动层";
        var tipLabel = new UICtor.cLabel(str,36);
        tipLabel.setColor(cc.color("#9c7966"));
        tipLabel.setPosition(255,105);
        bg.addChild(tipLabel);
    },

    addBagItems:function(data){
        var itemW = this.itemScroll.width/5;
        var itemH = this.itemScroll.height/5;

        this.itemW = itemW;
        this.itemH = itemH;

        var num = data.length;
        var contentH = Math.max(this.itemScroll.height,itemH*Math.ceil(num/4));
        this.itemScroll.setInnerContainerSize(cc.size(this.itemScroll.width,contentH));

        this.wanfaItems = [];
        this.posArr = [];
        for(var i = 0;i<num;++i){
            var item = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/pifu/img_item1.png");
            item.setPosition((i%4 + 1)*itemW,contentH - (Math.floor(i/4) + 0.5)*itemH);
            item.setContentSize(item.width + 45,item.height);
            item.flag = i;
            item.itemData = data[i];
            this.itemScroll.addChild(item,1);
            this.wanfaItems.push(item);
            this.posArr.push(item.getPosition());

            var bgKuang = new cc.Scale9Sprite("res/ui/bjdmj/popup/kuang2.png");
            bgKuang.setContentSize(item.getContentSize());
            bgKuang.setOpacity(120);
            bgKuang.setPosition(item.getPosition());
            this.itemScroll.addChild(bgKuang);

            var idx = UICtor.cLabel(i+1,36);
            idx.setTag(1);
            idx.setPosition(30,item.height/2);
            idx.setColor(cc.color(208,19,27));
            item.addChild(idx);

            var name = UICtor.cLabel(data[i].groupName,36);
            name.setAnchorPoint(0,0.5);
            name.setPosition(60,item.height/2);
            name.setColor(cc.color(208,19,27));
            item.addChild(name);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close || sender == this.btn_quxiao){
                PopupManager.remove(this);
            }else if(sender == this.btn_queding){
                var data = this.getChangData();
                if(data){
                    this.updateGroupTableConfig(data);
                }else{
                    PopupManager.remove(this);
                }
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    getChangData:function(){
        var cfgData = [];
        for(var i = 0;i<this.wanfaItems.length;++i){
            var item = this.wanfaItems[i];
            var idx = this.wanfaItems[i].flag;
            var tableOrder = item.itemData.config.tableOrder;
            if(tableOrder != idx + 1){
                cfgData.push(item.itemData.config.keyId + "," + (idx + 1));
            }
        }
        return cfgData.join(";");
    },

    updateGroupTableConfig:function(data){
        cc.log("==========updateGroupTableConfig=========",data);
        var params = {};
        params.optType = 1;
        params.groupId = ClickClubModel.getCurClubId();
        params.userId = PlayerModel.userId;
        params.sessCode = PlayerModel.sessCode;
        params.orderConfigs = data;

        var self = this;
        NetworkJT.loginReq("groupActionNew", "updateGroupTableConfig",params, function (data) {
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
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});