/**
 * Created by Administrator on 2017/7/6.
 */
var QFRoomSetPop = BasePopup.extend({
    ctor:function(){
        this._super("res/qfRoomSetPop.json");
    },

    selfRender:function(){
        this.Button_9 = this.getWidget("Button_20");//退出房间
        this.Button_8 = this.getWidget("Button_25");//解散房间
        this.Button_10 =this.getWidget("Button_23");//设置
        UITools.addClickEvent(this.Button_9,this,this.onLeave);
        UITools.addClickEvent(this.Button_10,this,this.onSetUp);
        UITools.addClickEvent(this.Button_8,this,this.onBreak);
    },

    onSetUp:function(){
        var mc = new SetUpPop();
        PopupManager.addPopup(mc);
    },

    /**
     * 解散
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
            PopupManager.remove(this);
        })
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        sySocket.sendComReqMsg(6);
        PopupManager.remove(this);
    },


})