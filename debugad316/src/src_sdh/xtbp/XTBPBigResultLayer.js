/**
 * Created by cyp on 2020/1/3.
 */
var XTBPBigResultLayer = SDHBigResultLayer.extend({

    initLayer:function(){
        this._super();

    },

    addResultItem:function(players){
        for(var i = 0;i<players.length;++i){
            var item = new XTBPBigResultItem();
            item.setItemWithData(players[i], players[i].userId == this.msgData.ext[1]);
            item.setPosition(cc.winSize.width/2,cc.winSize.height - 315 - i*173);
            this.addChild(item);
        }
    },

    /**
     * 分享战报
     */
    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var obj={};
        var tableId = SDHRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title="新田包牌结算";
        obj.description="房间号:" + tableId;
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

});

var XTBPBigResultItem = SDHBigResultItem.extend({

    initNode:function(){
        this._super();

        this.label_win_num = UICtor.cLabel("2胜2负",54);
        this.label_win_num.setColor(cc.color(254,233,95));
        this.label_win_num.setPosition(675,this.nodeBg.height/2);
        this.nodeBg.addChild(this.label_win_num);

    },

    setItemWithData:function(data,isFangZhu){
        this._super(data,isFangZhu);

        this.label_win_num.setString(data.ext[1] + "胜" + data.ext[2] + "负");
    },

});