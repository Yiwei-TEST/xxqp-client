/**
 * Created by Administrator on 2019/12/4.
 */

var HBGZPRePlayLayout = cc.Class.extend({
    initData:function(direct,mPanel,oPanel){
        this.direct = direct;
        this.mPanel = mPanel;
        this.oPanel = oPanel;
        this.data1 = [];
        this.data2 = [];
        this.data3 = [];
        this.mahjongs1 = [];
        this.mahjongs2 = [];
        this.mahjongs3 = [];
        this.handcardsid1 = [];
        this.handcardsid2 = [];
        this.handcardsid3 = [];
    },

    refresh:function(data1,data2,data3){
        if(data1[0]==""){
            data1.length = 0;
        }else{
            this.handcardsid1 = data1;
            this.handcardsid2 = data2;
            this.handcardsid3 = data3;
            data1 = this.transData(data1);
        }
        data2 = this.transData(data2);
        data3 = this.transData(data3);
        this.data1 = data1;
        this.data2 = data2;
        this.data3 = data3;
        this.refreshP2(data2);
        this.refreshP1(data1);
        this.refreshP3(data3);
    },

    handleLongBuZi:function(phzVo){
        // cc.log("this.data1 =",JSON.stringify(this.data1));
        // cc.log("phzVo =",JSON.stringify(phzVo));
        this.data1.push(phzVo);
        this.refreshP1(this.data1);

    },

    //转换数据
    transData:function(ids){
        var cardIds = [];
        for(var j=0;j<ids.length;j++){
            cardIds.push(HBGZPAI.getPHZDef(ids[j]));
        }
        return cardIds;
    },

    refreshByCurData:function(data1,data2,data3){
        this.mahjongs1.length=this.mahjongs2.length=this.mahjongs3.length=0;
        this.mPanel.removeAllChildren(true);
        this.oPanel.removeAllChildren(true);
        this.refreshP2(ArrayUtil.clone(data2));
        this.refreshP1(ArrayUtil.clone(data1));
        this.refreshP3(ArrayUtil.clone(data3));
    },


    clean:function(){
        this.mPanel.removeAllChildren(true);
        this.oPanel.removeAllChildren(true);
        this.mahjongs1.length = 0;
        this.mahjongs2.length = 0;
        this.mahjongs3.length = 0;
    },

    //出牌
    chuPai:function(phzVo){
        this.data3.push(phzVo);
        this.refreshP3(this.data3);
        this.delFromPlace1(phzVo.c);
    },
    //出牌后删除位置一上相应的牌
    delFromPlace1:function(id){
        var del = -1;
        for(var i=0;i<this.mahjongs1.length;i++){
            var card = this.mahjongs1[i];
            if(card.getData().c == id){
                del = i;
                card.removeFromParent(true);
                break;
            }
        }
        if(del>=0) {
            for (var i = 0; i < this.handcardsid1.length; i++) {
                if (this.handcardsid1[i] == id) {
                    this.handcardsid1.splice(i, 1);
                    break;
                }
            }
            this.mahjongs1.splice(del, 1);
            var index = -1;
            for (var i = 0; i < this.data1.length; i++) {
                if (this.data1[i].c == id) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                this.data1.splice(i, 1);
                this.refreshP1(this.data1);
            }
        }
    },

    //吃、碰、跑
    chiPai:function(ids,action){
        if(!this.data2){
            this.data2 = [];
        }
        var hasInsert = false;
        if(this.data2.length>0){
            if(action==HBGZPDisAction.HUA) {//先招后滑
                for(var i=0;i<this.data2.length;i++){
                    var innerObject = this.data2[i];
                    if(innerObject.action == HBGZPDisAction.ZHAO){//招
                        var vo = innerObject.cards[0];
                        if(vo.c > 0 && vo.n == HBGZPAI.getPHZDef(ids[0]).n){
                            this.assignInnerObjectByPao(innerObject,action,ids[0]);
                            hasInsert = true;
                            break;
                        }
                    }
                }
            }
        }
        if(!hasInsert){
            var voArray = HBGZPAI.getVoArray(ids);
            this.data2.push({action:action,cards:voArray});
        }
        this.refreshP2(this.data2);

        for(var i=0;i<ids.length;i++){
            this.delFromPlace1(ids[i]);
        }
    },

    assignInnerObjectByPao:function(innerObject,action,id){
        innerObject.action=action;
        var vo = HBGZPAI.getPHZDef(id);
        for(var j=0;j<innerObject.cards.length;j++){
            innerObject.cards[j].t = vo.t;
            innerObject.cards[j].n = vo.n;
            innerObject.cards[j].c = vo.c;
        }
        innerObject.cards.push(HBGZPAI.getPHZDef(id));
    },
    //碰牌、吃牌后位置三上面的牌也需要更新
    beiPengPai:function(id){
        var del = -1;
        for(var i=0;i<this.data3.length;i++){
            var p = this.data3[i];
            if(p.c == id){
                del = i;
                break;
            }
        }
        if(del>=0){
            this.data3.splice(del,1);
            var mahjong = this.mahjongs3[del];
            this.mahjongs3.splice(del,1);
            mahjong.removeFromParent(true);
            //if(mahjong.length>0){
            //    mahjong[0].pushOut();
            //}
        }
    },

    /**
     * 手动克隆data2的内容
     * @returns {Array}
     */
    getData2WithCloned:function(){
        var result = [];
        for(var i=0;i<this.data2.length;i++){
            var innerObject = this.data2[i];
            var cloneObject = {};
            cloneObject.action = innerObject.action;
            var cards = ArrayUtil.clone(innerObject.cards);
            for(var j=0;j<cards.length;j++){
                var card = cards[j];
                var clonedCard = {};
                for(var key in card){
                    clonedCard[key] = card[key];
                }
                cards[j] = clonedCard;
            }
            cloneObject.cards = cards;
            cloneObject.reverse = innerObject.reverse || 0;
            result.push(cloneObject)
        }
        return result;
    },


    refreshP1:function(data){
        this.data1 = data;
         //cc.log("data =",JSON.stringify(data));
        var result = HBGZPAI.sortHandsByHxVo(data);
        var place = this.direct == 1?1:2;
        var count = 0;
        var nowCords = this.mahjongs1.length;
        var w = this.getCardOffX();
        for(var i=0;i<result.length;i++){
            var array = result[i];
            var zorder = array.length;
            for(var j=0;j<array.length;j++){
                var card = null;
                if(count < nowCords){
                    //shift()用于把数组的第一个元素从其中删除，并返回第一个元素的值
                    card = this.mahjongs1.shift();
                    card.refresh(HBGZPAI.getDisplayVo(this.direct,place),array[j]);
                    card.setLocalZOrder(zorder);
                }else{
                    var isRecord = true;
                    card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,place),array[j],null,isRecord);
                    this.oPanel.addChild(card,zorder);
                }
                this.mahjongs1.push(card);
                if(this.direct == 1){
                    card.setScale(0.8);
                    card.x = -175*1.5+i*w * 0.8; //60
                    card.y = -330+j*117 * 0.8; //89
                }else{
                    card.setScale(0.5);
                    card.x = this.direct==2?i*57:-75+i*57;
                    if (this.direct == 2 && HBGZPRePlayModel.players.length == 2){
                        card.x = -75+i*57;
                    }
                    card.y = -120+j*54;
                }
                count++;
                zorder--;
            }
        }
    },

    //更新位置二（吃、碰）上的牌
    refreshP2:function(data){
        cc.log("this.data2======"+JSON.stringify(this.data2));
        this.data2 = data;
        var gx = 34 * 1.5;
        var gy = 30 * 1.5;
        var count = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<data.length;i++){
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var innerArray = innerObject.cards;
//            if(this.direct == 1 && !innerObject.reverse){//自己的牌需要倒序展示
//                //reverse() 方法用于颠倒数组中元素的顺序
////                innerArray = innerArray.reverse();
//                innerObject.reverse = 1;
//            }
            for(var j=0;j<innerArray.length;j++){
                var card = null;
                var innerVo = innerArray[j];
                if(count<nowCards){
                    //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
                    card = this.mahjongs2.shift();
                    card.refresh(HBGZPAI.getDisplayVo(this.direct,2),innerVo);
                }else{
                    card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,2),innerVo);
                    this.mPanel.addChild(card);
                    this.mahjongs2.push(card);
                }
                if(this.direct == 3 || this.direct == 4 || (this.direct == 2 && HBGZPRePlayModel.players.length == 2)){
                    card.x = i*gx;
                }else{
                    card.x = 160-i*gx;
                }
                if(this.direct == 1){
                    card.y = 100 * 1.5-j*gy;
                    if(innerArray.length == 5){
                        card.y = 100 * 1.5-j*gy* 4 / 5;
                    }
                }else{
                    card.y = 60 * 1.5-j*gy;
                    if(innerArray.length == 5){
                        card.y = 60 * 1.5-j*gy * 4 / 5;
                    }
                }
                card.setScale(0.4);
                count++;
            }
        }
    },
    //更新位置三（出牌）的牌
    refreshP3:function(data){
        this.data3 = data;
        var g = 30 * 1.5;
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refresh(HBGZPAI.getDisplayVo(this.direct,3),data[i]);
        }
        for(;i<data.length;i++){
            var card = new HBGZPCard(HBGZPAI.getDisplayVo(this.direct,3),data[i]);
            this.mahjongs3.push(card);
            if(this.direct == 3 || this.direct == 4|| (this.direct == 2 && HBGZPRePlayModel.players.length == 2)){
                card.x = i*g;
            }else{
                card.x = 160 - i*g;
            }
            card.y = (this.direct!=1)?120 * 1.5:160 * 1.5;
            card.setScale(0.4);
            this.mPanel.addChild(card);
        }

    },

    getCardOffX:function(){
        var x = parseInt(UITools.getLocalItem("hbgzp_zpdx"));
        var w = x == 1 ? 75 * 1.5 : 87 * 1.5;
        if (x == 3){
            w = w *1.1;
        }
        return w
    },

});