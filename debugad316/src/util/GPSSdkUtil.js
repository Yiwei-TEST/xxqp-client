/**
 * Created by zhoufan on 2017/3/22.
 */
var GPSModel = {

    gpsData:{},
    distanceList:{},
    alertContentArray:[],
    hasClickGpsBtn:false,

    clean:function(){
        this.gpsData = {};
        this.distanceList = {};
        this.alertContentArray.length=0;
    },

    getKeyByUserId:function(userId1,userId2){
        var key = userId1+"_"+userId2;
        if(userId2<userId1){
            key = userId2+"_"+userId1;
        }
        return key;
    },

    calcDistance:function(userId){
        var userIdArray = [];
        for(var key in this.gpsData){
            userIdArray.push(key);
        }
        this.alertContentArray.length=0;
        if(userIdArray.length>1){
            for(var n=0;n<userIdArray.length;n++){
                var first = userIdArray[n];
                var gps1 = this.gpsData[first];
                for(var i=0;i<userIdArray.length;i++){
                    if(i!=n){
                        var curUserId = userIdArray[i];
                        var userIdKey = this.getKeyByUserId(first,curUserId);
                        //更新距离
                        if(!this.distanceList[userIdKey] || (first==userId || curUserId==userId)){
                            var gps2 = this.gpsData[curUserId];
                            var distance = GPSSdkUtil.calcDistance(gps1,gps2);
                            distance = parseFloat(distance);
                            var finalDis = distance<0 ? 0 : distance;
                            this.distanceList[userIdKey] = finalDis;
                            if(distance>=0 && distance<=1000 && (first!=PlayerModel.userId&&curUserId!=PlayerModel.userId)){
                                this.alertContentArray.push({userId1:first,userId2:curUserId})
                            }
                            cc.log("GPSModel::"+userIdKey+" distance::"+distance);
                        }
                    }
                }
            }
            if(this.alertContentArray.length>0){
                //PopupManager.removeClassByPopup(GPSAlertPop);
                //PopupManager.addPopup(new GPSAlertPop());
            }
        }
    },

    getGpsData: function(userId) {
        var gps = this.gpsData[userId];
        if(!gps || gps.indexOf("error") >= 0){
            return null;
        }
        return gps;
    },

    updateGpsData:function(userId,gps,isCalc){
        this.gpsData[userId] = gps;
        if(isCalc){
            this.calcDistance(userId);
        }
        cc.log("updateGpsDataupdateGpsData真实距离");
        SyEventManager.dispatchEvent(SyEvent.DTZ_UPDATE_GPS);
    },

    getDistance:function(userId1,userId2){
        var key = this.getKeyByUserId(userId1,userId2);
        var distance = this.distanceList[key] || 0;
        if(distance>9999){
            distance = distance/1000;
            distance = MathUtil.toDecimal(distance);
            distance += "km";
        }else{
            distance = Math.round(distance);
            distance += "m";
        }
        return distance;
    },

    getDistanceValue:function(userId1,userId2){
        var key = this.getKeyByUserId(userId1,userId2);
        var distance = this.distanceList[key] || 0;
        return distance;
    },

    /**
     * 判断玩家是否有GPS数据 并且 距离小于xxx
     * 如果获取不到数据 返回false
     * userId list
     * distance
     */
    isPlayersClose:function(userIdList,distance){
        if(userIdList && distance){
            if(userIdList.length >= 2){
                for(var index = 0 ; index < userIdList.length ; index ++ ){
                    var aPlayer = userIdList[index];
                    for(var next = 0 ; next < userIdList.length ; next ++){
                        if(index != next){
                            var nextPlayer = userIdList[next];
                            if(GPSModel.getGpsData(aPlayer) && GPSModel.getGpsData(nextPlayer) ){
                                cc.log("获取到的距离为：：" , GPSModel.getDistanceValue(aPlayer , nextPlayer) , distance);
                                return GPSModel.getDistanceValue(aPlayer , nextPlayer) < distance;
                            }else{
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return false;

    },

    initData:function(){

    }

}
/**
 * 定位坐标点的vo
 * @type {{latitude: number, longitude: number}}
 */
var GPSPointVo = {
    latitude:0, //纬度
    longitude:0 //经度
};
var GPSSdkUtil = {

    isHasGPS:function(){
        if(SyConfig.hasOwnProperty("HAS_GPS")){
            if (SyConfig.isIos() && SdkUtil.isReview()) {
                return false;
            }
            return SyConfig.HAS_GPS;
        }else{
            return false;
        }
    },

    startLocation:function(){
        if(!this.isHasGPS())
            return;
        this.isStart = true;
        if(SyConfig.isIos() && SdkUtil.isExitsFunction("ios_sdk_startGPS")){
            cc.log("startLocation...................");
            ios_sdk_startGPS();
        }else if(SyConfig.isAndroid()){
            jsb.reflection.callStaticMethod("net/sy599/baidu/BaiduMapUtil", "start", "()V");
        }
    },

    stopLocation:function(){
        if(!this.isHasGPS())
            return;
        this.isStart = false;
        if(SyConfig.isIos()){
            ios_sdk_stopGPS();
        }else if(SyConfig.isAndroid()){
            jsb.reflection.callStaticMethod("net/sy599/baidu/BaiduMapUtil", "stop", "()V");
        }
    },

    /**
     *
     * @param latitude 纬度
     * @param longitude 经度
     */
    getLocationSuc:function(latitude,longitude){

        if(!this.isHasGPS())
            return;
        if(this.isStart){
            this.stopLocation();
            cc.log("latitude::"+latitude+" longitude::"+longitude);
            var isBaiDu = SyConfig.hasOwnProperty("AMAP") ? 0 : 1;
            sySocket.sendComReqMsg(30,[],[latitude+","+longitude+","+isBaiDu]);
        }
    },

    /**
     *
     * @param gpsStr
     * @returns {GPSPointVo}
     */
    getGPSPoint:function(gpsStr){
        var point = {};
        var strArray = gpsStr.split(",");
        point.latitude = strArray[0];
        point.longitude = strArray[1];
        point.isBaiDu = strArray[2];
        return point;
    },

    calcDistance:function(gps1,gps2){
        if(!this.isHasGPS())
            return -1;
        if(!gps1 || !gps2){
            SdkUtil.sdkLog("calcDistance......gps not define...");
            return -1;
        }
        if(gps1.indexOf("error") >= 0 || gps2.indexOf("error") >= 0) {
            return -1;
        }
        SdkUtil.sdkLog("calcDistance......1");
        var point1 = this.getGPSPoint(gps1);
        var point2 = this.getGPSPoint(gps2);
        var obj = {};
        obj.point1 = point1;
        obj.point2 = point2;
        var distance =0;
        if(SyConfig.isAndroid()){
            SdkUtil.sdkLog("calcDistance......2");
            distance=jsb.reflection.callStaticMethod("net/sy599/baidu/BaiduMapUtil", "calcDisByGPS", "(Ljava/lang/String;)Ljava/lang/String;",JSON.stringify(obj));
        }else if(SyConfig.isIos()){
            distance= ios_sdk_calcDisByGPS(JSON.stringify(obj));
        }
        return distance;
    }

}
