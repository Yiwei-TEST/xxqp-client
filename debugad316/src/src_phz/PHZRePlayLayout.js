/**
 * Created by Administrator on 2016/12/16.
 */

var PHZRePlayLayout = cc.Class.extend({
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
            cardIds.push(PHZAI.getPHZDef(ids[j]));
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
        var hasInsert = false;
        for(var i=0;i<this.data2.length;i++){
            var innerObject = this.data2[i];
            for(var j=0;j<innerObject.cards.length;j++) {
                var vo = innerObject.cards[j];
                if (vo.c == ids[0]){
                    hasInsert = true;
                }
            }
        }
        if(this.data2.length>0){
            if(action==PHZAction.TI||action==PHZAction.PAO || action == 11 || action == 18){//先偎后提、跑
                for(var i=0;i<this.data2.length;i++){
                    var innerObject = this.data2[i];
                    if( innerObject.action==PHZAction.WEI
                        || innerObject.action==PHZAction.CHOU_WEI
                        ||(innerObject.action==PHZAction.PENG&&action==PHZAction.PAO)){//先偎后跑、提，先碰后跑
                        var vo = innerObject.cards[0];
                        if(ArrayUtil.indexOf(ids,vo.c)>=0){
                            this.assignInnerObjectByPao(innerObject,action,ids[0]);
                            //if(action==PHZAction.PAO){
                            //    cc.log("assignInnerObjectByPao1::"+JSON.stringify(innerObject));
                            //}
                            hasInsert = true;
                            break;
                        }
                    }
                }
            }
        }
        if(!hasInsert){
            var voArray = PHZAI.getVoArray(ids);
            if(action==PHZAction.CHI && voArray.length>3){//一次性选择了多个吃
                while(voArray.length>0){
                    this.data2.push({action:action,cards:voArray.splice(0,3)});
                }
            }else{
                //if(action==PHZAction.PAO){
                //    cc.log("assignInnerObjectByPao2::"+JSON.stringify(voArray));
                //}
                this.data2.push({action:action,cards:voArray});
            }
        }
        this.refreshP2(this.data2);

        for(var i=0;i<ids.length;i++){
            this.delFromPlace1(ids[i]);
        }
    },

    assignInnerObjectByPao:function(innerObject,action,id){
        innerObject.action=action;
        var vo = PHZAI.getPHZDef(id);
        for(var j=0;j<innerObject.cards.length;j++){
            innerObject.cards[j].t = vo.t;
            innerObject.cards[j].n = vo.n;
            innerObject.cards[j].c = vo.c;
        }
        innerObject.cards.push(PHZAI.getPHZDef(id));
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
            var mahjong = this.mahjongs3.splice(del,1);
            if(mahjong.length>0){
                mahjong[0].pushOut();
            }
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
        // cc.log("data =",JSON.stringify(data));
        var result = PHZAI.sortHandsVo(data);
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
                    card.refresh(PHZAI.getDisplayVo(this.direct,place),array[j]);
                    card.setLocalZOrder(zorder);
                }else{
                    var isRecord = true;
                    card = new PHZCard(PHZAI.getDisplayVo(this.direct,place),array[j],null,isRecord);
                    this.oPanel.addChild(card,zorder);
                }
                this.mahjongs1.push(card);
                if(this.direct == 1){
                    card.setScale(0.8);
                    card.x = -400+i*w * 0.9; //60
                    card.y = -330+j*110 * 1; //89
                }else{
                    //card.setScale(0.8);
                    card.x = this.direct==2?i*45:-50+i*45;
                    if (this.direct == 2 && PHZRePlayModel.players.length == 2){
                        card.x = -50+i*45;
                    }
                    card.y = -40+j*45;
                }
                count++;
                zorder--;
            }
        }
    },

    //更新位置二（吃、碰）上的牌
    refreshP2:function(data){
        this.data2 = data;
        var gx = 40;
        var gy = 50;
        var count = 0;
        var nowCards = this.mahjongs2.length;
        for(var i=0;i<data.length;i++){
            var innerObject = data[i];
            var innerAction = innerObject.action;
            var innerArray = innerObject.cards;
            if(this.direct == 1 && !innerObject.reverse){//自己的牌需要倒序展示
                //reverse() 方法用于颠倒数组中元素的顺序
//                innerArray = innerArray.reverse();
                innerObject.reverse = 1;
            }
            for(var j=0;j<innerArray.length;j++){
                var card = null;
                var innerVo = innerArray[j];
                switch (innerAction){
                    case 3://偎
                        innerVo.as = 1;
                        break;
                    case 4://提
                        innerVo.a = 0;
                        innerVo.as = 0;
                        if(j>0)
                           innerVo.a=1;
                        break;
                    case 6://吃
                    	if(j==0)
                    		innerVo.zhe=1;
                        break;
                    case 7://跑
                        innerVo.as = innerVo.a = 0;
                        break;
                    case 10://臭偎
                        innerVo.a = 0;
                        innerVo.as = 0;
                        if(j>0)
                           innerVo.a=1;
                        break;
                }
                if(count<nowCards){
                    //shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
                    card = this.mahjongs2.shift();
                    card.refresh(PHZAI.getDisplayVo(this.direct,2),innerVo);
                }else{
                    card = new PHZCard(PHZAI.getDisplayVo(this.direct,2),innerVo);
                    this.mPanel.addChild(card);
                    this.mahjongs2.push(card);
                }
                if(this.direct == 3 || this.direct == 4 || (this.direct == 2 && PHZRePlayModel.players.length == 2)){
                    card.x = i*gx;
                }else{
                    card.x = 160-i*gx;
                }
                if(this.direct == 1){
                	card.y = 100-j*gy;
                }else{
                    card.y = 60-j*gy;
                }
                card.setScale(0.85);
                count++;
            }
        }
    },
    //更新位置三（出牌）的牌
    refreshP3:function(data){
        this.data3 = data;
        var g = 40;
        for(var i=0;i<this.mahjongs3.length;i++){
            this.mahjongs3[i].refresh(PHZAI.getDisplayVo(this.direct,3),data[i]);
        }
        for(;i<data.length;i++){
            var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),data[i]);
            this.mahjongs3.push(card);
        	if(this.direct == 3 || this.direct == 4|| (this.direct == 2 && PHZRePlayModel.players.length == 2)){
        		card.x = i*g;
        	}else{
        		card.x = 160-i*g;
        	}
            card.y = (this.direct!=1)?120:160;
            card.setScale(0.85);
            this.mPanel.addChild(card);
        }

    },

    getCardOffX:function(){
        var x = parseInt(UITools.getLocalItem("sy_phz_zpdx"));
        var w = x == 1 ? 114 : 132; //75
        if (PHZSetModel.zpdx == 3 || PHZSetModel.zpdx == 4 ){
            w = w *1.1;
        }
        return w
    },

});