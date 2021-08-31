/**
 * Created by mayn on 2019/5/8.
 */
var ClubCreditScoreTypePop = BasePopup.extend({
    ctor:function(parent,type){

        this.selectType = type || 0;
        this.parentLayer = parent;

        this._super("res/selectScoreType.json");
    },

    getConfigArr:function(){
        var configArr = ["全部", "转移比赛分", "赠送分", "输赢分", "洗牌分"];
        return configArr;
    },

    selfRender:function(){

        var configArr = this.getConfigArr();

        this.itemArr = [];
        var parent = this.getWidget("mainPopup");
        for(var i = 0;i<configArr.length;++i){
            var item = new SelectBox(1,configArr[i]);
            item.x = parent.width/2 - 70;
            item.y = parent.height/2 + 150 - 85*i;
            item.temp = i;
            parent.addChild(item);
            item.addChangeCb(this,this.onStateChange);

            this.itemArr.push(item);
        }

        this.setSelectItem();

        UITools.addClickEvent(this.getWidget("btnTrue"),this,this.onClickTrueBtn);
    },

    onStateChange:function(item){
        this.selectType = item.temp;
        this.setSelectItem();
    },

    setSelectItem:function(){
        for(var i = 0;i<this.itemArr.length;++i){
            this.itemArr[i].setSelected(this.itemArr[i].temp == this.selectType);
        }
    },

    onClickTrueBtn:function(){
        if(this.parentLayer && this.parentLayer.updateSelectType){
            this.parentLayer.updateSelectType(this.selectType);
        }
        this.onCloseHandler();
    },
});

var ClubChangeRadioPop = ClubCreditScoreTypePop.extend({
    ctor:function(parent,type){
        this._super(parent,type);
    },
    getConfigArr:function(){
        var configArr = ["1:1","1:10","1:100"];
        return configArr;
    },


    onClickTrueBtn:function(){
        //var radioArr = [1,10,100];
        //if(this.parentLayer && this.parentLayer.changeClubRadio){
        //    this.parentLayer.changeClubRadio(radioArr[this.selectType]);
        //}

        var self = this;
        var str = "修改比例请联系游戏客服！";
        AlertPop.showOnlyOk(str,function(){
            self.onCloseHandler();
        });
    },
});

var ClubChangeAlertTypePop = ClubCreditScoreTypePop.extend({
    ctor:function(parent,type){
        this._super(parent,type);
    },
    getConfigArr:function(){
        var configArr = ["全部","邀请","申请","踢出"];
        return configArr;
    },

    onClickTrueBtn:function(){
        if(this.parentLayer && this.parentLayer.changeAlertType ){
            this.parentLayer.changeAlertType(this.selectType);
        }

        this.onCloseHandler();
    },
});

var GoldChangeAlertTypePop = ClubCreditScoreTypePop.extend({
    ctor:function(parent,type){
        this._super(parent,type);
    },
    getConfigArr:function(){
        var configArr = ["全部","邀请","踢出"];
        return configArr;
    },

    onClickTrueBtn:function(){
        if(this.selectType == 2)this.selectType = 3
        if(this.parentLayer && this.parentLayer.changeAlertType ){
            this.parentLayer.changeAlertType(this.selectType);
        }

        this.onCloseHandler();
    },
});