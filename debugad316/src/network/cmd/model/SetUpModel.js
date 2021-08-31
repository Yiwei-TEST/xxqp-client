/**
 * Created by zhoufan on 2017/1/4.
 */
var SetUpModel = {
    //1/2/3三个值
    mjbgVal:0,
    mjVal:0,
    musicVal:0,
    initData:function(v1,v2,v3){
        this.mjbgVal = v1 ? parseInt(v1) : 1;
        this.mjVal = v2 ? parseInt(v2) :1;
        this.musicVal = v3 ? parseInt(v3) :1;
    },

    getMahjongRes:function(png){
        var array = png.split(".");
        if(this.mjVal==2){
            png = array[0]+"_2.png";
        }else if(this.mjVal==3){
            png = array[0]+"_3.png";
        }else{
            png = array[0]+"_1.png";
        }

        return png;
    }
}