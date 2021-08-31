/**
 * Created by zhoufan on 2016/6/30.
 */
var PKBigResultPop = BasePopup.extend({
    ctor: function (json) {
        this._super(json);
    },

    selfRender: function () {


    },

    getModel: function () {


    },

    /**
     * 分享战报
     */
    onShare:function(){

    },

    onToHome:function(){
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.remove(this);
        PopupManager.removeAll();
        var isClubRoom =  (this.getModel().tableType == 1);
        if(isClubRoom){
            PopupManager.removeClassByPopup(PyqHall);
            var mc = new PyqHall();//先不弹出吧
            PopupManager.addPopup(mc);
        }
    }
});
