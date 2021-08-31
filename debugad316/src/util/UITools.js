/**
 * Created by zhoufan on 2016/6/24.
 */
var UITools = {
    isShowLog:true,
    addClickEvent:function(widget,target,cb,playAudio){
        if(!widget){
            cc.log("1111");
        }else{
            widget.addTouchEventListener(function(obj,type){
                if(type == ccui.Widget.TOUCH_ENDED){
                    if(playAudio==undefined || playAudio==true)
                        AudioManager.play("res/audio/common/audio_button_click.mp3");
                    cb.call(target,obj);
                }
            });
        }
    },

    /**
     * 判断是否是同一天
     */
    checkIsSameDay:function(paramDate){
        if(new Date(paramDate).toDateString() === new Date().toDateString()){
            //cc.log("checkIsSameDay is same::" , new Date(paramDate).toDateString()  , new Date().toDateString());
            return true;
        }else{
            //cc.log("checkIsSameDay is not same::" , Date(paramDate).toDateString()  , new Date().toDateString());
            return false;
        }
    },

    /**
     * 获取客户端文件缓存内容
     */
    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    /**
     * 设置客户端文件缓存内容
     * @param m
     * @returns {*}
     */
     setLocalItem:function(key , value){
        cc.sys.localStorage.setItem(key,value);
    },


    /**
     ** 转化成json存在本地
     * **/
    setLocalJsonItem:function(key , json){
        var  value = JSON.stringify(json);
        cc.sys.localStorage.setItem(key,value);
    },

    /**
     ** 读取基础数据
     *还回json格式数据
     * **/
    getLocalJsonItem:function(key){
        var value = cc.sys.localStorage.getItem(key); //从本地读取数据
        var json = {};
        if (value){
            json = JSON.parse(value); //将string转换成json
        }
        return json;
    },


    add0:function(m){
        return m<10?'0'+m:m+""
    },

    truncateLabel:function(str, num) {

        var tempLen = 0;
        var chineseRegex = /[^\x00-\xff]/g;
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i).toString();
            if (char.match(chineseRegex) != null) {
                tempLen += 2;
            } else {
                tempLen++;
            }
            if(tempLen > num*2)break;
        }

        return str.substr(0,i);
    },

    formatTime:function(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        //cc.log("shijianchuo ..." , shijianchuo);
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return UITools.add0(m)+'月'+UITools.add0(d)+'日'
    },

    formatDetailTime:function(timeStr){
        var data = new Date(timeStr);
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        var day = data.getDate();

        var hour = data.getHours();
        var min = data.getMinutes();
        var sec = data.getSeconds();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;

        var str = year + "-" + month + "-" + day + "\n" + hour + ":" + min + ":" + sec;
        return str;
    },


    /**
     * 老李要 "20180123"这样的日期 不要时间戳
     * 君子不争 君子不争....。
     */
    dealTimeToServer:function(shijianchuo){
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+UITools.add0(m)+UITools.add0(d);
    },

    /**
     * 图片url
     * 父节点
     * 裁剪节点路劲 不指定则不适用裁剪功能
     * x
     * y
     * scale
     */
    showIcon: function (iconUrl,iconNode,clipNodePath,defaultimg,x,y,scale) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var icon = iconNode;
        var defaultimg = "res/res_dtz/images/default_m.png"||defaultimg;
        var tUseClipNode = true;
        var tScale = scale || 1;
        if(clipNodePath == null || clipNodePath.length < 3){
            tUseClipNode = false;
        }

        if(icon.iconUrlData != null && icon.iconUrlData == iconUrl){
            cc.log("同节点 同头像 避免重复加载")
            return;
        }

        var sprite = new cc.Sprite(defaultimg);
        if(!tUseClipNode){
            if (icon.getChildByTag(345)) {
                icon.removeChildByTag(345);
            }

            sprite.x = x||icon.width * 0.5;
            sprite.y = y||icon.height * 0.5;
            icon.addChild(sprite, 5, 345);
            if (iconUrl) {
                cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                    if (!error) {
                        sprite.setTexture(img);
                        icon.iconUrlData = iconUrl;
                    }
                });
            }
        }else{
            if(iconUrl){
                sprite.x = sprite.y = 0;
                try{
                    var scale = tScale;
                    var sten = new cc.Sprite(clipNodePath);
                    sten.setScale(scale);
                    var clipnode = new cc.ClippingNode();
                    clipnode.attr({stencil: sten, anchorX: 0.5, anchorY: 0.5, x: x, y: y, alphaThreshold: scale});
                    clipnode.addChild(sprite);
                    icon.addChild(clipnode,5,345);
                    var self = this;
                    cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                        if (!error) {
                            sprite.setTexture(img);
                            icon.iconUrlData = iconUrl;
                            sprite.x = 0;
                            sprite.y = 0;
                        }else{
                            self._iconUrl = "";
                        }
                    });
                }catch(e){}
            }else{
                sprite.x = x || icon.width * 0.5;
                sprite.y = y || icon.height * 0.5;
                icon.addChild(sprite,5,345);
            }
        }

    },

    //处理id 后面两位用*号代替
    dealId: function (id) {
        var idStr = id.toString();
        var str = "";
        for(var i=0;i < idStr.length;i++){
            if (i == idStr.length - 2 || i == idStr.length -1){
                str = str + "*";
            }else{
                str = str + idStr[i];
            }
        }
        //cc.log("dealId",str);
        return str;
    },

    dealUserId: function (id) {
        var idStr = id.toString();
        var str = "";
        for(var i=0;i < idStr.length;i++){
            if (i == 0 || i == idStr.length -1){
                str = str + idStr[i];
            }else{
                str = str + "*";
            }
        }
        //cc.log("dealUserId",str);
        return str;
    },

    dealUserName: function (name) {
        var nameStr = name.toString();
        var str = "";
        for(var i=0;i < nameStr.length;i++){
            if (i == 0){
                str = str + nameStr[i];
            }else{
                str = str + "*";
            }
        }
        return str;
    },

    /**
     * 四舍五入十位数
     */
    dealScore:function(value){
        //return value;//屏蔽四舍五入功能
        if(value == 0){
            return 0;
        }
        //cc.log("dealScore ... " , value + "--->" + Math.round(value / 100) * 100);
        if(value < 0) {
            return -Math.round(-value / 100) * 100;
        }
        return  Math.round(value / 100) * 100;
    },

    /**
     * 处理日志数据
     */
    dealLog:function(str){
        if(this.isShowLog && str){
            cc.log(JSON.stringify(str))
        }
    },

    /**
     * 数字转字符串
     */
    moneyToStr:function(moneyValue,limitValue){
        if(moneyValue == null){
            return "--"
        }
        var moneyNum = Number(moneyValue);
        var moneyStr = moneyNum + "";
        //小于100W直接显示数字
        var limitValue = limitValue || 100000;
        if(moneyNum < limitValue){
            return moneyStr;
        }

        //百万内 保留1位
        if((10000000 > moneyNum) && (moneyNum >= 10000)) {
            //moneyStr = parseFloat(moneyNum / 10000).toFixed(2) + "万";
            moneyStr = Math.floor(parseFloat(moneyNum / 10000) * 10) / 10 + "万"
        }else if( 100000000 > moneyNum && (moneyNum >= 10000000)){ //千万以上 亿以下 保留两位
            moneyStr = Math.floor(parseFloat(moneyNum / 10000) * 100) / 100 + "万"
        }else if(moneyNum >= 100000000){
            moneyStr = Math.floor(parseFloat(moneyNum / 100000000) * 10) / 10 + "亿"
        };
        return moneyStr + "";
    },

    showTiketInRoom:function(){
        var num = 0;
        if(BaseRoomModel.isClubGoldRoom() && BaseRoomModel.curRoomData.nowBurCount <= 1){
            num = BaseRoomModel.curRoomData.generalExt[3];
        }else{
            return;
        }

        var tiketNode = new TiketShowInRoom(num);
        tiketNode.setPosition(cc.winSize.width,cc.winSize.height/3);
        sy.scene.addChild(tiketNode,10);

        var action = cc.sequence(cc.delayTime(3), cc.callFunc(function (node) {
            node.removeFromParent(true);
        }));
        tiketNode.runAction(action);

    },

    dealNameLength: function (name,length) {
        var nameStr = name.toString();
        var str = "";
        for(var i=0;i < nameStr.length;i++){
            if (i <= length ){
                str = str + nameStr[i];
            }
        }
        //cc.log("dealNameLength",str);
        return str;
    },

    insertStr:function(soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start);
    }
}

/**
 * Created by cyp on 2020/6/24.
 * 亲友圈豆子结算房间
 * 房间里面统一显示房费
 */
var TiketShowInRoom = cc.Node.extend({
    ctor:function(num){
        this._super();

        this.initNode(num);
    },

    initNode:function(num){

        this.imgTiket = new cc.Sprite("res/res_mj/common/gold_mp.png");
        this.imgTiket.setAnchorPoint(1, 0.5);
        this.addChild(this.imgTiket, 1);

        var label = new cc.LabelBMFont(num, "res/font/gold_mp.fnt");
        label.setPosition(this.imgTiket.width * 0.68, this.imgTiket.height * 0.85);
        this.imgTiket.addChild(label, 1);

    },
});