/**
 * Created by Administrator on 2020/8/6.
 */

var QueQiaoConfigModel = {

    clickId:null,//超量领取id
    isHasPlayEnd:false,//超量领取广告结束

    tag:null,// 活动主题
    activityName:"",// 活动名称
    startTime:"",// 活动开始时间
    endTime:"",// 活动结束时间
    desc:"",// 活动描叙
    playNum:0,// 当天金币场对局数
    goldNum:0,// 活动获得的金币总数

    sqqm:[],//自己鹊桥领奖进度信息

    teammateId:null,// 队友id
    teammateWxName:null,//队友微信名
    teammateIcon:null,//队友头像
    teammatPlayNum:null,//队友对局数

    inviteList:[],//邀请人列表

    isHasRedPoint:false,//邀请列表是否有红点

    newRedPoint:false,//图标红点

    init:function(data){
        if(!data){
            return;
        }

        this.tag = data.tag;
        this.activityName = data.activityName;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.playNum = data.playNum;
        this.goldNum = data.goldNum;
        this.sqqm = data.sqqm || [];
        this.teammateId = data.teammateId;
        this.teammateWxName = data.teammateWxName;
        this.teammateIcon = data.teammateIcon;
        this.teammatPlayNum = data.teammatPlayNum;

        this.sqqm.sort(function(a,b){
            if(a && b){
                return parseInt(a.id) - parseInt(b.id);
            }
        });

        var popLayer = PopupManager.getClassByPopup(QixiQueQiaoPop);
        if(!popLayer){
            popLayer = new QixiQueQiaoPop();
            PopupManager.addPopup(popLayer);
        }else{
            popLayer.initData();
        }
    },

    saveInviteList:function(data){
        this.inviteList = data.qqim;
        var popLayer = PopupManager.getClassByPopup(QixiYaoQingPop);
        if(!popLayer){
            popLayer = new QixiYaoQingPop();
            PopupManager.addPopup(popLayer);
        }else{
            popLayer.updateQaoQingList();
        }
    }
}

var ActivityQueQiaoResResponder = BaseResponder.extend({
    respond:function(message){
        cc.log(" 收到鹊桥数据 ActivityQueQiaoResResponder:"+JSON.stringify(message));
        //QueQiaoConfigModel.init(message);
    }
})

var QueQiaoInviteBoardMsgResponder = BaseResponder.extend({
    respond:function(message){
        cc.log(" 邀请人信息 QueQiaoInviteBoardMsgResponder:"+JSON.stringify(message));
        //QueQiaoConfigModel.saveInviteList(message);
    }
})
