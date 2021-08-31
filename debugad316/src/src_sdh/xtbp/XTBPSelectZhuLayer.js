/**
 * Created by cyp on 2019/12/27.
 */
var XTBPSelectZhuLayer = SDHSelectZhuLayer.extend({

    showLayerType:function(type){
        this.layerBg.setVisible(true);

        this.layerType = type;

        var newArr = [];

        for (var i = 0; i < this.btnArr.length; ++i) {
            var btn = this.btnArr[i];
            if (type == 2) {
                if (btn.flag != 0 && (btn.flag != SDHRoomModel.selectZhu)) {
                    newArr.push(btn);
                } else {
                    btn.setVisible(false);
                }
            } else {
                if (btn.flag != 5 && btn.flag != 0) {
                    newArr.push(btn);
                } else {
                    btn.setVisible(false);
                }
            }
        }


        var offsetX = 210;
        for (var i = 0; i < newArr.length; ++i) {
            var btn = newArr[i];
            btn.setVisible(true);
            btn.setPositionX(this.layerBg.width / 2 + (i - (newArr.length - 1) / 2) * offsetX);
        }

        var img = type == 1 ? "res/res_sdh/qzdzp.png" : "res/res_sdh/qxzlshs.png";
        this.titleSpr.initWithFile(img);

    },

    handleTableData:function(type,data){
        this._super(type,data);

        if(type == SDHTabelType.CreateTable){

        }else if(type == SDHTabelType.DingZhuang){
            if(data.params.length > 0){
                this.layerBg.setVisible(false);
            }
        }
    },

});
