/**
 * Created by zhoufan on 2016/8/4.
 */
var DTZSyVersion = {
    v:"v1.0.7",

    parseVersion:function(v){
        v = v.substr(1, v.length);
        var splitArray = v.split(".");
        var v1 = splitArray[0];
        var v2 = splitArray[1];
        var v3 = splitArray[2];
        return {v1:v1,v2:v2,v3:v3};
    },

    isNeedUpdate:function(serverVersion){
        var clentVersion = this.v;
        var clentData = this.parseVersion(clentVersion);
        var serverData = this.parseVersion(serverVersion);
        if(parseInt(clentData.v1) < parseInt(serverData.v1)){
            return true;
        } else if(parseInt(clentData.v1) > parseInt(serverData.v1)) {
            return false;
        }
        if(parseInt(clentData.v2) < parseInt(serverData.v2)){
            return true;
        } else if(parseInt(clentData.v2) > parseInt(serverData.v2)) {
            return false;
        }
        if(parseInt(clentData.v3) < parseInt(serverData.v3)){
            return true;
        }
        return false;
    }
}
