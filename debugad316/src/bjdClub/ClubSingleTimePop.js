/**
 * Created by Administrator on 2017/7/21.
 */
/**
 * 排行榜弹框
 */
var ClubSingleTimePop = BasePopup.extend({

    ctor:function(parenNode  , endTime,dayNum){
        this.parentNode = parenNode;
        this.defaultendTime = endTime || 0;

        this.dayNum = dayNum || 30;

        this._super("res/clubSingleTimePop.json");
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    selfRender:function(){
        this.endViewList = this.getWidget("endTimeList");
        this.btnSure = this.getWidget("btnSure");
        if(this.btnSure){
            UITools.addClickEvent(this.btnSure , this , this.onSure);
        }

        var t = new Date();
        var toDay = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1);//当天凌晨
        this.endTime = toDay;
        cc.log("this.beginTime..." , toDay);
        this.createItems(this.endViewList , this.endTime , this.defaultendTime , 2);

    },

    createItems:function(parentNode , orTime , defaltTime , itemType){
        var hasChoice = false;
        var firstItem = null;
        var offScorll = 0;
        if(parentNode){
            for(var index = 0; index < this.dayNum ; index++){
                var tTime = orTime - 24 * index * 3600 * 1000;
                var tItem = new timeSingleItem(tTime , this , itemType);
                if(index == 0){
                    firstItem = tItem;
                }
                parentNode.pushBackCustomItem(tItem);
                if(defaltTime != 0){
                    if((tTime) == defaltTime){
                        if(index >= 5){
                            offScorll = index;
                        }
                        tItem.choiceTime();
                        hasChoice = true;
                    }
                }
            }
        }

        if(parentNode){
            parentNode.refreshView();//没有这个 scrollToPercentVertical不会生效
        }

        if(hasChoice == false && firstItem){
            firstItem.choiceTime();
        }else if(offScorll != 0){
            cc.log("移动条目...");
            parentNode.scrollToPercentVertical(((offScorll+1) / 30 * 100) , 0 ,false)
        }

    },

    removeItem:function(index){
        this.endViewList.removeItem(index)
        if(this.defaultendTime == 0){
            var tItem = this.endViewList.getItem(0)
            tItem.choiceTime();
        }
    },

    onSure:function(){
        if(this.parentNode){
            //this.parentNode.changeSearchTime(this.beginTime , this.endTime);
            SyEventManager.dispatchEvent(SyEvent.RESET_SINGLE_TIME,{
                endTime:this.endTime
            });
            PopupManager.remove(this);
        }else{
            FloatLabelUtil.comText("结束时间不可早于开始时间");
        }
    },

    fixRightShow:function(){
        var allItem = this.endViewList.getItems();
        for(var index = 0 ; index < allItem.length ; index++){
            var item = allItem[index];
            item.fixShow();
        }

    },

    saveClickBeginTime:function(clickTime){
        this.beginTime = clickTime
    },

    saveClickEndTime:function(clickTime){
        this.endTime = clickTime;
    },

});


/**
 * 我的信用分item
 */

var timeSingleItem = ccui.Widget.extend({

    ctor:function(data , parenteNode , type){
        this.curTime = data;
        this.parenteNode = parenteNode;
        this.itemType = type;
        this._super();
        this.setContentSize(400, 96);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(400,96),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var lbTime=this.lbTime= UICtor.cLabel("01月29日",36,null,cc.color(255,255,255),0,1);
        lbTime.setPosition(200,48);
        Panel_16.addChild(lbTime);
        var line=this.line= UICtor.cImg("res/ui/bjdmj/popup/extImg/memberLine.png");
        line.setPosition(200,90);
        Panel_16.addChild(line);
        var line2=this.line2= UICtor.cImg("res/ui/bjdmj/popup/extImg/memberLine.png");
        line2.setPosition(cc.p(0+line.getAnchorPointInPoints().x, -84+line.getAnchorPointInPoints().y));
        line.addChild(line2);
        var isChoice=this.isChoice= UICtor.cImg("res/ui/bjdmj/popup/extImg/sign.png");
        isChoice.setPosition(60,48);
        Panel_16.addChild(isChoice);


        this.line.visible = false;
        this.isChoice.visible = false;

        this.addChild(Panel_16);
        this.setData(this.curTime);
        Panel_16.setTouchEnabled(true);
        UITools.addClickEvent(this.Panel_16 , this , this.choiceTime);

    },

    fixShow:function(){
        this.line.visible = false;
        this.isChoice.visible = false;
        this.lbTime.setColor(cc.color(255,255,255))
    },

    choiceTime:function(){
        cc.log("click event ...");
        if(this.parenteNode){
            this.parenteNode.fixRightShow();
            this.parenteNode.saveClickEndTime(this.curTime)
            this.lbTime.setColor(cc.color(255,111,24))
            this.line.visible = true;
            this.isChoice.visible = true;
        }
    },

    add0:function(m){
        return m<10?'0'+m:m+'';
    },

    isSelected:function(){
        return this.isChoice.visible;
    },

    formatTime:function(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return this.add0(m)+'月'+this.add0(d)+'日'
    },

    setData:function(data){
        this.lbTime.setString(this.formatTime(data));
    },

});



