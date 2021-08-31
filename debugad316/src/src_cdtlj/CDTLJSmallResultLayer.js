/**
 * Created by cyp on 2019/9/9.
 */

var CDTLJSmallResultLayer = cc.Layer.extend({
    ctor:function(msgData,isReplay){
        this._super();

        this.msgData = msgData;
        this.isReplay = isReplay;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
        this.setLayerWithData();
        this.showRuleInfo();
    },

    setLayerWithData:function(){
        if(!this.msgData)return;

        this.setTypeInfo();

        var players = this.msgData.closingPlayers || [];

        for(var i = 1;i<4;++i){
            this.userNameArr[i].setVisible(false);
        }

        var titleType = 1;

        var hasZhuang = false;
        for(var i = 0;i<players.length;++i){
            if(players[i].boom == 1){
                hasZhuang = true;
                break;
            }
        }

        this.icon_zhuang.setVisible(hasZhuang);

        var idx = hasZhuang?1:0;
        var curIdx = 0;
        for(var i = 0;i<players.length;++i){
            var p = players[i];
            if(p.boom == 1){//庄家
                curIdx = 0;
            }else{
                curIdx = idx;
                idx++;
            }
            if(this.userNameArr[curIdx]){
                this.userNameArr[curIdx].setVisible(true);

                this.userNameArr[curIdx].setString(p.name);
                var point = p.point;
                if(point > 0)point = "+" + point;
                this.userScoreArr[curIdx].setString(point);

                if(CDTLJRoomModel.isFzbHide() && !CDTLJRoomModel.replay
                    && p.userId != PlayerModel.userId){
                    this.userNameArr[curIdx].setString("玩家" + (curIdx + 1));
                }
            }

            if(p.seat == CDTLJRoomModel.mySeat){
                this.addBenRenIcon(curIdx);
                titleType = point > 0?1:-1;
            }
        }

        this.addTitleImg(titleType);
    },

    setTypeInfo:function(){
        var zhuangfen = this.msgData.ext[22];

        this.label_jiaofen.setString("级数:" + zhuangfen);
        this.label_defen.setString("得分:" + this.msgData.ext[23]);

        var typeArr = [];

        var config = {"-3":"大倒","-2":"小倒","-1":"垮庄","1":"过庄","2":"小光","3":"大光"};
        var type = CDTLJRoomModel.getScoreType(this.msgData.ext[23]);

        if(this.msgData.ext[26] == 1){
            typeArr.push("超时");
        }else if(config[type]){
            typeArr.push(config[type]);
        }

        if(this.msgData.ext[24] == 1)typeArr.push("抠底");

        var typeStr = "";
        for(var i = 0;i< typeArr.length;++i){
            if(i == 1 || i == 3)typeStr += " ";
            if(i == 2)typeStr += "\n";
            typeStr += typeArr[i];
        }

        this.label_type.setString(typeStr);
    },

    showRuleInfo:function(){
        var str = ClubRecallDetailModel.getCDTLJWanfa(CDTLJRoomModel.intParams,true);

        str = str.replace(/\s/g,"\n");

        var label = UICtor.cLabel(str,36);
        label.setAnchorPoint(0,0.5);
        label.setColor(cc.color(239,145,87));
        label.setPosition(30,cc.winSize.height/2);
        this.addChild(label,1);
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(210);
        this.addChild(grayLayer);

        var bg = new cc.Sprite("res/res_cdtlj/jiesuan/di.png");
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        this.layerBg = bg;

        this.userNameArr = [];
        this.userScoreArr = [];
        var name = UICtor.cLabel("玩家的名字",38);
        name.setAnchorPoint(0,0.5);
        name.setTextAreaSize(cc.size(300,40));
        name.setPosition(120,475);
        bg.addChild(name,1);
        this.userNameArr.push(name);

        var num_bg = new cc.Sprite("res/res_cdtlj/jiesuan/huobi1.png");
        num_bg.setPosition(240,225);
        bg.addChild(num_bg,1);

        var label_num = UICtor.cLabel("-12345",54);
        label_num.setColor(cc.color(234,94,18));
        label_num.setPosition(num_bg.getPosition());
        bg.addChild(label_num,1);
        this.userScoreArr.push(label_num);

        var icon_zhuang = new cc.Sprite("res/res_cdtlj/jiesuan/zhuang.png");
        icon_zhuang.setPosition(80,475);
        bg.addChild(icon_zhuang,1);

        this.icon_zhuang = icon_zhuang;

        this.label_jiaofen = UICtor.cLabel("叫分:80",38);
        this.label_jiaofen.setAnchorPoint(0,0.5);
        this.label_jiaofen.setPosition(60,390);
        bg.addChild(this.label_jiaofen,1);

        this.label_defen = UICtor.cLabel("得分:60",38);
        this.label_defen.setAnchorPoint(0,0.5);
        this.label_defen.setPosition(60,315);
        bg.addChild(this.label_defen,1);

        this.label_type = UICtor.cLabel("",54);
        this.label_type.setColor(cc.color(255,245,84));
        this.label_type.setPosition(355,355);
        bg.addChild(this.label_type,2);

        for(var i = 0;i<3;++i){
            var label_name = UICtor.cLabel("玩家的名字",38);
            label_name.setAnchorPoint(0,0.5);
            label_name.setTextAreaSize(cc.size(225,40));
            label_name.setPosition(510,475 - i*123);
            bg.addChild(label_name,1);

            var num_bg = new cc.Sprite("res/res_cdtlj/jiesuan/huobi2.png");
            num_bg.setPosition(315,label_name.height/2);
            label_name.addChild(num_bg,1);

            var label_num = UICtor.cLabel("+12345",38);
            label_num.setPosition(num_bg.getPosition());
            label_name.addChild(label_num,1);

            this.userNameArr.push(label_name);
            this.userScoreArr.push(label_num);
        }

        this.btn_jxyx = new ccui.Button("res/res_cdtlj/jiesuan/btn_jixu.png","res/res_cdtlj/jiesuan/btn_jixu.png");
        this.btn_jxyx.setPosition(cc.winSize.width/2,180);
        this.addChild(this.btn_jxyx,2);

        this.btn_jxyx.addTouchEventListener(this.onClickBtn,this);

        //this.btn_close = new ccui.Button("res/ui/bjdmj/popup/close1.png","res/ui/bjdmj/popup/close1.png");
        //this.btn_close.setPosition(cc.winSize.width - 100,cc.winSize.height - 100);
        //this.addChild(this.btn_close,10);
        //
        //this.btn_close.addTouchEventListener(this.onClickBtn,this);
    },

    addBenRenIcon:function(idx){
        var icon = new cc.Sprite("res/res_cdtlj/jiesuan/benren.png");
        icon.setAnchorPoint(0,1);
        icon.setPosition(idx == 0?6:486,idx <=1?533:533 - (idx-1)*123);
        this.layerBg.addChild(icon,2);
    },

    addTitleImg:function(type){
        var img = "res/res_cdtlj/jiesuan/biaoti.png";
        if(type < 0){
            img = "res/res_cdtlj/jiesuan/biaoti1.png";
        }
        var title = new cc.Sprite(img);
        title.setPosition(this.layerBg.width/2,this.layerBg.height);
        this.layerBg.addChild(title,1);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_jxyx){
                PopupManager.remove(this);

                if(CDTLJRoomModel.replay){
                    return;
                }

                if((CDTLJRoomModel.nowBurCount == CDTLJRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
                    var BigResultLayer = CDTLJRoomModel.getBigResultLayer();
                    var layer = new BigResultLayer(this.msgData);
                    PopupManager.addPopup(layer);

                }else{
                    sySocket.sendComReqMsg(3);
                }
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});
