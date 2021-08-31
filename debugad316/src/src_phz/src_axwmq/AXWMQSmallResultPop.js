/**
 * Created by cyp on 2020/6/9.
 */
var AXWMQSmallResultPop = cc.Layer.extend({
    ctor:function(data,isReplay){
        this._super();

        this.resultData = data;
        this.isReplay = isReplay || false;

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
        this.setLayerWithData();
    },

    setLayerWithData:function(){
        if(!this.resultData)return;

        var playersData = this.resultData || [];

        //排序把胡牌的放前面
        playersData.sort(function (user1 , user2){
            var point1 = parseInt(user1.point);
            var point2 = parseInt(user2.point);
            return  point1 < point2;
        });

        //是否黄庄
        var isHuang = !(ClosingInfoModel.huSeat > 0);
        var isWin = false;
        for(var i = 0;i<playersData.length;++i){
            var p = playersData[i];
            this.addUserInfo(p,i+1);
            this.setScoreLabel(p,i+1);
            this.addUserCards(this.getShowCardsData(p.seat),i+1);
            if(p.userId == PlayerModel.userId){
                isWin = (p.point > 0);
            }
        }
        var titleType = -1;
        if(isWin)titleType = 1;
        if(isHuang)titleType = 0;
        this.addLayerTitle(titleType);

        var leftCards = ClosingInfoModel.leftCards || [];
        this.addDiPai(leftCards);

        var str1 = "房间号:" + ClosingInfoModel.ext[0];
        var jushu = PHZRoomModel.nowBurCount;
        if(this.isReplay)jushu = PHZRePlayModel.playCount;
        str1 += " 第" + jushu + "局";
        if(this.isReplay)str1 += " 回放";

        var str2 = this.getTimeStr() + " " + SyVersion.v;

        var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
        var ruleStr = ClubRecallDetailModel.getSpecificWanfa(intParams);

        this.addRoomInfo(str1,str2,ruleStr);

        this.img_hu.setVisible(!isHuang);
        this.label_mt.setString(this.getMingTangInfo());
        if(playersData.length < 3){
            this.item_di_3.setVisible(false);
        }

    },

    getShowCardsData:function(seat){
        var data = ClosingInfoModel.allCardsCombo || [];

        var retData = [];
        var item = null;
        for(var i = 0;i<data.length;++i){
            if(data[i].seat == seat){
                item = data[i];
            }
        }

        if(item){
            var phzCards = item.phzCard;
            for(var i = 0;i<phzCards.length;++i){
                var obj = {action:phzCards[i].action};
                if(phzCards[i].action == 0 && phzCards[i].cards.length > 3){
                    for(var t = 0;t<phzCards[i].cards.length;t+=3){
                        obj = {action:0};
                        var end = t+3;
                        if(end > phzCards[i].cards.length){
                            end = phzCards[i].cards.length;
                        }
                        obj.cards = phzCards[i].cards.slice(t,end);
                        retData.push(obj);
                    }

                }else{
                    obj.cards = phzCards[i].cards;
                    retData.push(obj);
                }
            }
        }

        retData.sort(function(a,b){
            if(a.action == 0 && b.action == 0){
                return b.cards.length - a.cards.length;
            }else if(a.action == 0 || b.action == 0){
                return b.action - a.action;
            }
            return 0;
        });

        return retData;
    },

    getMingTangInfo:function(){
        var configObj = {
            1:"对子胡",2:"乌对",3:"乌胡",4:"点胡",5:"印胡",6:"纯印",7:"红胡",
            8:"多红",9:"满园花",10:"大字胡",11:"小字胡",12:"两乱卓",13:"姐妹卓",
            14:"三乱卓",15:"姐妹卓带拖",16:"嗲孙卓",17:"四乱卓",18:"嗲孙卓带拖",
            19:"海底胡",20:"单调",21:"真八碰头",22:"假八碰头",23:"背靠背",24:"手牵手",
            25:"龙摆尾",26:"卡煨",27:"天胡",28:"全求人",29:"项对",30:"飘对",31:"上下五干年",
            32:"全黑",33:"无息胡",34:"六对红",35:"九对",36:"鸡丁",37:"两炸弹",38:"四边对",
            39:"边胡",40:"真背靠背",41:"凤摆尾",42:"卡胡",43:"自摸胡",44:"项项息",45:"隔山打牛",
            46:"捉小三",47:"二息满园花",48:"假凤摆尾",49:"假龙摆尾",50:"圆圆丁",51:"心连心",
            52:"二龙戏珠",53:"美女踩单车",54:"红炸弹",55:"黑炸弹",56:"有息天胡",57:"一条龙",
            58:"祖孙卓",59:"啫啫胡",60:"边丁",61:"逗溜子",62:"嵌胡",63:"对倒胡"
        }

        var data = ClosingInfoModel.fanTypes || [];

        var itemArr = [];
        for(var i = 0;i<data.length;++i){
            var num = data[i];
            var mingtang = Math.floor(num/10000);//高两位
            var type = Math.floor(num/1000)%10;//中间1位
            var huxi = num%1000;//低三位
            if(configObj[mingtang]){

                if(type == 2){
                    itemArr.push(configObj[mingtang] + "+" + huxi + "息");
                }else if(type == 1){
                    itemArr.push(configObj[mingtang] + "*" + huxi);
                }
            }

        }

        return itemArr.join(" ");
    },

    setScoreLabel:function(data,idx){
        var label_yx = this.label_yx_1;
        var label_score = this.label_score_1;
        var label_zx = this.label_zx_1;

        if(idx == 2){
            label_yx = this.label_yx_2;
            label_score = this.label_score_2;
        }else if(idx == 3){
            label_yx = this.label_yx_3;
            label_score = this.label_score_3;
        }else if(idx == 1){
            var num_zx = ClosingInfoModel.totalTun || 0;
            label_zx.setString("" + num_zx);
        }
        label_yx.setString("" + data.allHuxi);
        label_score.setString("" + data.point);
    },

    getTimeStr:function(){
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min + "0" + min;
        return hour + ":" + min;
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(180);
        this.addChild(grayLayer);
        this.grayLayer = grayLayer;

        var layerBg = new cc.Sprite("res/res_phz/axwmq/img_bg.png");
        layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 30);
        this.addChild(layerBg);
        this.layerBg = layerBg;

        this.roomBtnNode = new cc.Node();
        this.roomBtnNode.setPosition(cc.winSize.width/2,cc.winSize.height*2/3);
        this.addChild(this.roomBtnNode);
        this.roomBtnNode.setVisible(false);

        var img = "res/res_phz/phzSmallResult/btnXiaojie.png";
        this.btn_show_jiesuan = new ccui.Button(img,img,"");
        this.btn_show_jiesuan.addTouchEventListener(this.onClickBtn,this);
        this.btn_show_jiesuan.setPosition(-280,0);
        this.roomBtnNode.addChild(this.btn_show_jiesuan);

        var img = "res/res_phz/phzSmallResult/btnJixuyouxi.png";
        this.btn_jixu = new ccui.Button(img,img,"");
        this.btn_jixu.addTouchEventListener(this.onClickBtn,this);
        this.btn_jixu.setPosition(280,0);
        this.roomBtnNode.addChild(this.btn_jixu);

        var img = "res/res_phz/axwmq/btn_ready.png";
        var btn_ready = new ccui.Button(img,img,"");
        btn_ready.addTouchEventListener(this.onClickBtn,this);
        btn_ready.setPosition(layerBg.width/2 + 300,65);
        layerBg.addChild(btn_ready,1);

        var img = "res/res_phz/axwmq/btn_show_desk.png";
        var btn_show_desk = new ccui.Button(img,img,"");
        btn_show_desk.addTouchEventListener(this.onClickBtn,this);
        btn_show_desk.setPosition(layerBg.width/2 - 300,btn_ready.y);
        layerBg.addChild(btn_show_desk,1);

        var item_di_1 = new cc.Sprite("res/res_phz/axwmq/img_di1.png");
        item_di_1.setAnchorPoint(0,0);
        item_di_1.setPosition(30,140);
        layerBg.addChild(item_di_1,0);

        var item_di_2 = new cc.Sprite("res/res_phz/axwmq/img_di2.png");
        item_di_2.setAnchorPoint(0,1);
        item_di_2.setPosition(item_di_1.x + item_di_1.width + 7,item_di_1.y + item_di_1.height);
        layerBg.addChild(item_di_2,0);

        var item_di = new cc.Sprite("res/res_phz/axwmq/img_di3.png");
        item_di.setAnchorPoint(0,0);
        item_di.setPosition(item_di_2.x,item_di_1.y);
        layerBg.addChild(item_di,0);

        var item_di_3 = new cc.Sprite("res/res_phz/axwmq/img_di2.png");
        item_di_3.setAnchorPoint(0,0);
        item_di_3.setPosition(item_di_2.x,item_di_1.y);
        layerBg.addChild(item_di_3,1);

        var font1 = "res/font/bjdmj/fzcy.TTF";
        var font2 = "res/res_phz/axwmq/score_num.fnt";

        var txt_base = new ccui.Text("硬息:",font1,45);
        txt_base.setColor(cc.color(202,91,25));
        txt_base.setAnchorPoint(0,0.5);
        txt_base.setPosition(45,item_di_1.height/2);
        item_di_1.addChild(txt_base,0);

        this.label_yx_1 = new cc.LabelBMFont("100",font2);
        this.label_yx_1.setAnchorPoint(0,0.3);
        this.label_yx_1.setPosition(txt_base.x + txt_base.width + 15,txt_base.y);
        item_di_1.addChild(this.label_yx_1,1);

        var txt = txt_base.clone();
        txt.setPosition(15,45);
        item_di_2.addChild(txt,0);

        this.label_yx_2 = new cc.LabelBMFont("100",font2);
        this.label_yx_2.setAnchorPoint(0,0.3);
        this.label_yx_2.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_2.addChild(this.label_yx_2,1);

        var txt = txt_base.clone();
        txt.setPosition(15,45);
        item_di_3.addChild(txt,0);

        this.label_yx_3 = new cc.LabelBMFont("100",font2);
        this.label_yx_3.setAnchorPoint(0,0.3);
        this.label_yx_3.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_3.addChild(this.label_yx_3,1);

        var txt = txt_base.clone();
        txt.setString("总息:");
        txt.setPosition(360,item_di_1.height/2);
        item_di_1.addChild(txt,0);

        this.label_zx_1 = new cc.LabelBMFont("1000",font2);
        this.label_zx_1.setAnchorPoint(0,0.3);
        this.label_zx_1.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_1.addChild(this.label_zx_1,1);

        var txt = txt_base.clone();
        txt.setString("分数:");
        txt.setPosition(45,item_di_1.height/2 - 80);
        item_di_1.addChild(txt,0);

        this.label_score_1 = new cc.LabelBMFont("100000",font2);
        this.label_score_1.setAnchorPoint(0,0.3);
        this.label_score_1.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_1.addChild(this.label_score_1,1);

        var txt = txt_base.clone();
        txt.setString("分数:");
        txt.setPosition(360,45);
        item_di_2.addChild(txt,0);

        this.label_score_2 = new cc.LabelBMFont("100000",font2);
        this.label_score_2.setAnchorPoint(0,0.3);
        this.label_score_2.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_2.addChild(this.label_score_2,1);

        var txt = txt_base.clone();
        txt.setString("分数:");
        txt.setPosition(360,45);
        item_di_3.addChild(txt,0);

        this.label_score_3 = new cc.LabelBMFont("100000",font2);
        this.label_score_3.setAnchorPoint(0,0.3);
        this.label_score_3.setPosition(txt.x + txt.width + 15,txt.y);
        item_di_3.addChild(this.label_score_3,1);

        var info_bg = new cc.Sprite("res/res_phz/axwmq/info_bg.png");
        info_bg.setAnchorPoint(0,0);
        info_bg.setPosition(30,30);
        item_di_1.addChild(info_bg,0);

        var txt = txt_base.clone();
        txt.setString("名堂:");
        txt.setAnchorPoint(0,1);
        txt.setPosition(15,info_bg.height - 10);
        info_bg.addChild(txt,0);

        this.label_mt = new cc.LabelTTF("啫啫胡","Arial",40);
        this.label_mt.setColor(cc.color(125,82,21));
        this.label_mt.setDimensions(cc.size(info_bg.width - 140,0));
        this.label_mt.setAnchorPoint(0,1);
        this.label_mt.setPosition(130,info_bg.height - 10);
        info_bg.addChild(this.label_mt,0);

        this.img_hu = new cc.Sprite("res/res_phz/act_button/hu.png");
        this.img_hu.setPosition(item_di_1.width - 120,item_di_1.height/2 - 30);
        item_di_1.addChild(this.img_hu,1);

        this.item_di_1 = item_di_1;
        this.item_di_2 = item_di_2;
        this.item_di_3 = item_di_3;

        this.btn_ready = btn_ready;
        this.btn_show_desk = btn_show_desk;

    },

    addLayerTitle:function(type){
        var img = "res/res_phz/axwmq/title_hz.png";
        if(type > 0)img = "res/res_phz/axwmq/title_win.png";
        if(type < 0)img = "res/res_phz/axwmq/title_lose.png";

        this.img_title = new cc.Sprite(img);
        this.img_title.setPosition(this.layerBg.width/2,this.layerBg.height);
        this.layerBg.addChild(this.img_title,1);
    },

    addUserInfo:function(data,idx){
        var parent = this.item_di_1;
        if(idx == 2)parent = this.item_di_2;
        if(idx == 3)parent = this.item_di_3;

        var headBg = new cc.Sprite("res/res_phz/axwmq/img_kuang.png");
        headBg.setAnchorPoint(0,1);
        headBg.setPosition(30,parent.height - 30);
        parent.addChild(headBg,0);

        var sten=new cc.Sprite("res/res_phz/header_mask.png");
        sten.setScale(170/sten.width);
        var clipnode = new cc.ClippingNode();
        clipnode.setStencil(sten);
        clipnode.setAlphaThreshold(0.8);
        var iconSpr = new cc.Sprite("res/ui/common/default_m.png");
        iconSpr.setScale(170/iconSpr.width);
        clipnode.addChild(iconSpr);
        clipnode.setPosition(headBg.width/2,headBg.height/2);
        headBg.addChild(clipnode,1);

        var label_name = ccui.Text("玩家的名字在这里啊","res/font/bjdmj/fzcy.TTF",40);
        label_name.setTextAreaSize(cc.size(200,45));
        label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        label_name.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        label_name.setColor(cc.color(125,82,21));
        label_name.setPosition(headBg.x + headBg.width/2,headBg.y - headBg.height - 30);
        parent.addChild(label_name,0);

        this.showIcon(iconSpr,data.icon);
        label_name.setString(data.name);
    },

    showIcon: function (iconSpr,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    iconSpr.setTexture(img);
                    iconSpr.setScale(170/iconSpr.width);
                }
            });
        }else{
            iconSpr.initWithFile(defaultimg);
        }
    },

    addUserCards:function(data,idx){
        var parent = this.item_di_1;
        if(idx == 2)parent = this.item_di_2;
        if(idx == 3)parent = this.item_di_3;

        for(var i = 0;i<data.length;++i){
            var item = new AXWMQCardItem(data[i]);
            item.setPosition(300 + i*80,parent.height - 50);
            parent.addChild(item,1);
        }
    },

    addDiPai:function(ids){

        var txt_base = new ccui.Text("底牌:","res/font/bjdmj/fzcy.TTF",45);
        txt_base.setAnchorPoint(0,0.5);
        txt_base.setPosition(45,this.layerBg.height - 120);
        this.layerBg.addChild(txt_base,1);

        var scroll = new ccui.ScrollView();
        scroll.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        scroll.setContentSize(1650,80);
        scroll.setPosition(txt_base.x + 120,txt_base.y - 30);
        this.layerBg.addChild(scroll,1);

        var num = ids.length;
        var itemW = 50;

        scroll.setInnerContainerSize(cc.size(Math.max(scroll.width,num*itemW),scroll.height));

        for(var i = 0;i<num;++i){
            var vo = PHZAI.getPHZDef(ids[i]);
            var card = new PHZCard(PHZAI.getDisplayVo(1,3),vo);
            card.setPosition(i*itemW,0);
            scroll.addChild(card);
        }

    },

    addRoomInfo:function(str1,str2,ruleStr){
        var label_info1 = new ccui.Text(str1,"res/font/bjdmj/fzcy.TTF",36);
        label_info1.setAnchorPoint(0,0.5);
        label_info1.setPosition(45,this.layerBg.height - 30);
        this.layerBg.addChild(label_info1,0);

        var label_info2 = new ccui.Text(str2,"res/font/bjdmj/fzcy.TTF",36);
        label_info2.setAnchorPoint(1,0.5);
        label_info2.setPosition(this.layerBg.width - 45,this.layerBg.height - 30);
        this.layerBg.addChild(label_info2,0);

        var label_rule = new ccui.Text(ruleStr,"res/font/bjdmj/fzcy.TTF",30);
        label_rule.setTextAreaSize(cc.size(450,0));
        label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        label_rule.setAnchorPoint(0,1);
        label_rule.setPosition(30,130);
        this.layerBg.addChild(label_rule);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_ready || sender == this.btn_jixu){

                if(this.isReplay){
                    LayerManager.showLayer(LayerFactory.HOME);
                    PopupManager.remove(this);
                    return;
                }


                if(ClosingInfoModel.ext[6] == 1) {//最后的结算
                    PopupManager.remove(this);
                    var mc = new PHZBigResultPop(this.resultData);
                    PopupManager.addPopup(mc);
                }else{
                    if(PHZRoomModel.isStart){
                        PHZRoomModel.cleanSPanel();
                        PopupManager.remove(this);
                    }
                    sySocket.sendComReqMsg(3);
                }



            }else if(sender == this.btn_show_desk){
                this.layerBg.setVisible(false);
                this.grayLayer.setVisible(false);
                this.roomBtnNode.setVisible(true);
            }else if(sender == this.btn_show_jiesuan){
                this.layerBg.setVisible(true);
                this.grayLayer.setVisible(true);
                this.roomBtnNode.setVisible(false);
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

var AXWMQCardItem = ccui.Widget.extend({
    ctor:function(data){
        this._super();

        this.cardsData = data || {};

        this.initNode();
    },

    initNode:function(){
        this.item_type = new cc.Sprite(this.getTypeImg(this.cardsData.action));
        this.addChild(this.item_type);

        var ids = this.cardsData.cards || [];

        for(var i = 0;i<ids.length;++i){
            var vo = PHZAI.getPHZDef(ids[i]);
            if(ids[i] == ClosingInfoModel.huCard){
                vo.ishu = true;
            }

            var card = new PHZCard(PHZAI.getDisplayVo(1,3),vo);
            card.setPosition(-23,i*60 - 220);
            this.addChild(card,5-i);
        }
    },

    getTypeImg:function(action){
        var img = "";

        var cfgObj = {
            0:"shou",1:"hu",2:"peng",3:"wei",6:"chi",8:"kan",10:"wei"
        }

        if(cfgObj[action]){
            img = "res/res_phz/axwmq/flag_" + cfgObj[action] + ".png";
        }

        return img;
    },
});