/**
 * Created by Administrator on 2020/3/20.
 */
var YZLCNewSmallResultCell = ccui.Widget.extend({
    ctor:function(data){
        this._super();
        var cards = data.cards;
        this.anchorX=0;
        this.anchorY=0;
        var width = 70;
        var zorder = cards.length;
        if(zorder > 4){
            width = 130;
        }
        this.setContentSize(width,300);
        for(var i=0;i<cards.length;i++){
            zorder--;
            var vo = PHZAI.getPHZDef(cards[i]);
            var card = new YZLCCard(PHZAI.getDisplayVo(this.direct,3),vo);
            if(i < 4){
                card.x = 4;
                card.y = 40 + i * 39;
            }else{
                card.x = 40;
                card.y = 40 + (i%4) * 39;
            }
            card.scale = 1.5;
            this.addChild(card,zorder);
        }
    }
});

var YZLCSmallResultPop=BasePopup.extend({
    pointInfo:null,
    isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = !!isRePlay;
        var path = "res/phzSmallResult.json";
        if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
            path = "res/phzSmallResultTwo.json";
        }
        this._super(path);
    },

    selfRender: function () {
        var isHuang = false;
        this.winUserId = 0;
        this.data.sort(function (user1 , user2){
            var point1 = parseInt(user1.point);
            var point2 = parseInt(user2.point);
            return  point1 < point2;
        });
        var myPoint = 0;
        var isYk = false;
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)){
                myPoint = this.data[i].point;
                isYk = true;
            }
        }
        var Image_84 = this.getWidget("Image_84");
        var imgUrl = myPoint > 0 ? "res/res_phz/phzSmallResult/image_win.png" : "res/res_phz/phzSmallResult/image_lose.png";

        if(this.isRePlay && !isYk){
            imgUrl = "res/res_phz/phzSmallResult/image_win.png";
        }

        Image_84.loadTexture(imgUrl);

        for(var i=0;i<this.data.length;i++){
            if(this.data[i].point>0){
                break;
            }else if(this.data[i].point==0){
                isHuang = true;
                break;
            }
        }

        this.getWidget("Image_HZ").visible = isHuang;

        if(this.data.length==3){
            this.getWidget("user4").visible = false;
        }else if(this.data.length==2){
            this.getWidget("user4").visible = false;
            this.getWidget("user3").visible = false;
        }

        var xingSeat = -1;
        var huSeat = -1;
        for(var i=0;i<this.data.length;i++){
            if(this.isSpecialPHZ()){
                this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i],this.pointInfo[i] , i);
            }else {
                this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
            }
            if(this.data[i].seat == this.data[i].isShuXing){
                xingSeat = i;
            }
            if(ClosingInfoModel.huSeat == this.data[i].seat){
                huSeat = i;
            }
        }
        this.list = this.getWidget("ListView_6");
        this.list.width = 500;

        var list = new ccui.ListView();
        //list.setContentSize(800,800);
        list.setTouchEnabled(true);
        list.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        list.width = 500;
        list.height = this.list.height;
        list.x = this.list.x;
        list.y = this.list.y;
        //list.setPosition(0,110);
        this.list.addChild(list,1);
        this.newListView = list;

        var cards = ClosingInfoModel.cards;
        if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
            this.list_two = this.getWidget("ListView_6_0");
            this.list_two.visible = true;
        }

        //if(PHZRoomModel.is2Ren()&& PHZRoomModel.isSpecialWanfa()){
        //    if(ClosingInfoModel.huSeat){
        //        if(ClosingInfoModel.allCardsCombo[0].seat != ClosingInfoModel.huSeat){
        //            ClosingInfoModel.allCardsCombo.reverse();
        //        }
        //    }
        //    for(var i=0;i < ClosingInfoModel.allCardsCombo.length;i++){
        //        var cards = ClosingInfoModel.allCardsCombo[i].phzCard || [];
        //        for(var j=0;j<cards.length;j++){
        //            // cc.log("cards[i] =",JSON.stringify(cards[i]));
        //            var cell = new YZLCSmallResultCell(cards[j],true);
        //            if(i == 0){
        //                if(isHuang){
        //                    if(j === cards.length -1){
        //                        break;
        //                    }
        //                }
        //                this.list.pushBackCustomItem(cell);
        //            }else{
        //                if(j === cards.length -1){
        //                    break;
        //                }
        //                this.list_two.pushBackCustomItem(cell);
        //            }
        //        }
        //    }
        //    if(isHuang){//如果是黄庄
        //        var temp = ClosingInfoModel.allCardsCombo[0].phzCard;
        //        var selfCard = temp[temp.length - 1].cards || [];
        //        var cardVo = PHZAI.getVoArray(selfCard);//剩余的牌
        //        var result = PHZAI.sortHandsVo(cardVo);
        //        for(var i=0;i<result.length;i++){
        //            var cell = new onCell(result[i]);
        //            this.list.pushBackCustomItem(cell);
        //        }
        //    }
        //    var temp = ClosingInfoModel.allCardsCombo[1].phzCard;
        //    var otherCards = temp[temp.length - 1].cards || [];
        //    var cardVo = PHZAI.getVoArray(otherCards);//剩余的牌
        //    var result = PHZAI.sortHandsVo(cardVo);
        //    for(var i=0;i<result.length;i++){
        //        var cell = new onCell(result[i]);
        //        this.list_two.pushBackCustomItem(cell);
        //    }
        //}else {
            for(var i=0;i<cards.length;i++){
                var cell = new YZLCNewSmallResultCell(cards[i],true);
                this.newListView.pushBackCustomItem(cell);
            }
        //}

        var dipaiPanel = this.getWidget("Panel_dipai");
        dipaiPanel.visible = false;
        this.getWidget("Panel_dipai").visible = false;

        var maipaiPanel = this.getWidget("Panel_maipai");
            maipaiPanel.visible=false;

        var huxi = this.getWidget("huxi");
        var allStr = "";
        if(ClosingInfoModel.huxi>0){
            allStr += "戳子:"+ClosingInfoModel.huxi + "\n";
        }else{
            this.getWidget("huxi").visible = false;
        }

        var str = "";
        var tunStr = "";
        var isHas = false;
        if (ClosingInfoModel.fanTypes){
            var data = ClosingInfoModel.fanTypes || [];
            var configObj = {
                1: " 黑戳 ", 2: " 红戳 ", 3: " 见红加分 ",
                4: " 红戳 "
            };
            for(var i=0;i<data.length;i++) {
                if (data[i]) {
                    var tempVal = parseInt(data[i]);
                    var tunshu = tempVal % 100;
                    tempVal = Math.floor(tempVal/100);
                    tempVal = Math.floor(tempVal / 10);
                    var typeVal = tempVal % 100;
                    if (configObj[typeVal]) {
                        if(typeVal != 3){
                            isHas = true;
                            str += configObj[typeVal] + "*" + tunshu;
                        }else{
                            str += configObj[typeVal] + "+" + tunshu;
                        }
                    }
                }
                str += "\n";
            }
        }

        if(ClosingInfoModel.tun > 0){
            tunStr += "基本分"+ClosingInfoModel.tun + "\n";
            if(!isHas){/** 不是黑戳红戳才显示基本分 **/
                allStr += tunStr;
            }
        }

        huxi.setString("");
        var zimo = this.getWidget("zimo"); //自摸文本
        zimo.y = huxi.y;
        zimo.x = huxi.x;
        zimo.setString(allStr+str);//显示所有文字

        this.resultView = this.getWidget("resultView");
        this.roomView = this.getWidget("roomView");

        this.Button_2 = this.getWidget("Button_2");
        this.Button_Ready = this.getWidget("btnReady");
        UITools.addClickEvent(this.Button_2,this,this.onOk);
        UITools.addClickEvent(this.Button_Ready,this,this.onOk);

        this.Button_zm = this.getWidget("Button_15");
        this.Button_toResultView = this.getWidget("btnToResultView");

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn, this, function () {
            sySocket.sendComReqMsg(4501, [], "");
            this.issent = true;
            PopupManager.remove(this);
            this.onOk();
        });
        if (PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1) {
            xipai_btn.visible = false;
        } else {
            xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
        }
        var xpkf = PHZRoomModel.creditXpkf.toString() || 0;
        this.getWidget("label_xpkf").setString(xpkf);

        UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
        this.onJieSuan();
        var btn_jiesan = this.getWidget("btn_jiesan");
        var btn_share = this.getWidget("btn_share");
        btn_share.visible = false;
        UITools.addClickEvent(btn_share,this,this.onShare);
        UITools.addClickEvent(btn_jiesan,this,this.onBreak);

        var btn_handXq = this.getWidget("btn_handXq");
        UITools.addClickEvent(btn_handXq,this,this.onHandCard);

        btn_jiesan.visible = !this.isRePlay;
        this.Button_zm.visible = !this.isRePlay;
        this.Button_Ready.visible = !this.isRePlay;
        btn_handXq.visible = !this.isRePlay;

        var Image_40 = this.getWidget("Image_40"); //自摸图片
        Image_40.visible = false;

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.getWidget("Label_time")){
            this.getWidget("Label_time").setString(hours+":"+minutes);
        }

        this.getWidget("Label_roomnum").setString("房间号:"+ClosingInfoModel.ext[0]);
        var jushuStr = "第" + PHZRoomModel.nowBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        this.getWidget("Label_wanfa").setString(wanfaStr);
        if(this.isRePlay){
            this.getWidget("Label_jushu").setString("第" + PHZRePlayModel.playCount + "局");
        }

        if (this.isRePlay){
            this.getWidget("replay_tip").visible =  true;
        }
    },

    isSpecialPHZ:function(){
        return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
    },

    refreshSingle:function(widget,user,pointInfo , index){
        // cc.log("index..." , index);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.isShuXing){
            if(user.seat == user.isShuXing){
                ccui.helper.seekWidgetByName(widget,"sx").visible = true;
            }else{
                ccui.helper.seekWidgetByName(widget,"sx").visible = false;
            }
        }else{
            ccui.helper.seekWidgetByName(widget,"sx").visible = false;
        }

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
        var defaultimg = "res/res_phz/default_m.png";
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale=0.95;
        sprite.x = 40;
        sprite.y = 40;
        widget.addChild(sprite,5,345);
        //sprite.setScale(1.05);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var point = ccui.helper.seekWidgetByName(widget,"point");

        var pointStr = "";
        var totalPointStr = "";
        if (parseInt(user.point) > 0 ){
            pointStr = "+" + user.point;
        }else{
            pointStr = "" + user.point;
        }

        var label = new cc.LabelTTF(pointStr, "res/font/bjdmj/fznt.ttf", 30);
        label.setColor(cc.color(128,21,6));
        //var label = new cc.LabelBMFont(user.point+"",fnt);
        label.anchorX = 0;
        label.x = 0;
        label.y = 15;
        point.addChild(label,6);

        if (user.totalPoint != null ){
            totalPointStr = "" + user.totalPoint;
            var str = "累计:" + totalPointStr;

            var totalPoint = ccui.helper.seekWidgetByName(widget,"totalPoint");
            var label1 = new cc.LabelTTF(str, "res/font/bjdmj/fznt.ttf", 30);
            label1.setColor(cc.color(128,21,6));
            //var label = new cc.LabelBMFont(user.totalPoint+"","res/font/font_res_phz1.fnt");
            label1.anchorX = 0;
            //label1.anchorY = 0;
            label1.x = 0;
            label1.y = 15;
            totalPoint.addChild(label1,6);
        }

        //增加房主的显示
        if(user.userId == ClosingInfoModel.ext[1]){
            var fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
            fangzhu.anchorX = fangzhu.anchorY = 0;
            fangzhu.x = 32;
            fangzhu.y = 30;
            widget.addChild(fangzhu,10);
        }
        if (index == 0){
            var nowPoint = this.getWidget("nowPoint");
            nowPoint.setString("共计:" + user.point);
        }
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            if(PopupManager.getClassByPopup(YZLCReplay)){
                PopupManager.removeClassByPopup(YZLCReplay);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        // var isDjtgEnd = 0;
        if(ClosingInfoModel.ext[3] == GameTypeEunmZP.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
            if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){//最后的结算
                PopupManager.remove(this);
                var mc = new YZLCBigResultPop(data);
                PopupManager.addPopup(mc);
                var obj = HongBaoModel.getOneMsg();
                if(obj){
                    var mc = new HongBaoPop(obj.type,obj.data);
                    PopupManager.addPopup(mc);
                }
            }else{
                if (PHZRoomModel.isStart){
                    PHZRoomModel.cleanSPanel();
                    PopupManager.remove(this);
                    sySocket.sendComReqMsg(3);
                }else{
                    sySocket.sendComReqMsg(3);
                }
            }
        }else{
            if(ClosingInfoModel.ext[6] == 1){//最后的结算
                PopupManager.remove(this);
                var mc = new YZLCBigResultPop(data);
                PopupManager.addPopup(mc);
                var obj = HongBaoModel.getOneMsg();
                if(obj){
                    var mc = new HongBaoPop(obj.type,obj.data);
                    PopupManager.addPopup(mc);
                }
            }else{
                if (PHZRoomModel.isStart){
                    PHZRoomModel.cleanSPanel();
                    PopupManager.remove(this);
                    sySocket.sendComReqMsg(3);
                }else{
                    sySocket.sendComReqMsg(3);
                }
            }
        }
    },

    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        },null,2)
    },

    onShare:function(){

    },

    onHandCard:function(){
        var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
        PopupManager.open(mc,true);
    },

    onJieSuan:function(){
        this.resultView.visible = true;
        this.roomView.visible = false;
    },

    onZhuoMian:function(){
        this.resultView.visible = false;
        this.roomView.visible = true;
    }
});
