/**
 * Created by leiwenwen on 2018/10/15.
 */
/**
 * 亲友圈所有玩法的分成的item
 */
var ClubAgentManageItem = ccui.Widget.extend({
    ctor:function(data,root,index){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(890, 105);


        var Panel_21=this.Panel_21= UICtor.cPanel(cc.size(900,95),cc.color(0,0,0),0);
        Panel_21.setAnchorPoint(cc.p(0,0));
        Panel_21.setPosition(0,0);
        var Image_bg=this.Image_bg= UICtor.cImg("res/ui/bjdmj/popup/extImg/img_1.png");
        Image_bg.setPosition(452,47);
        Panel_21.addChild(Image_bg);
        Image_bg.scale = 0.94;
        var Label_order=this.Label_order= UICtor.cLabel("1",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_order.setPosition(49,47);
        Panel_21.addChild(Label_order);
        var Label_name=this.Label_name= UICtor.cLabel("100",25,cc.size(130,30),cc.color(126,49,2),1,0);
        Label_name.setPosition(201,47);
        Panel_21.addChild(Label_name);
        var Label_game=this.Label_game= UICtor.cLabel("100",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_game.setPosition(347,47);
        Panel_21.addChild(Label_game);
        var Label_score=this.Label_score= UICtor.cLabel("100",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_score.setPosition(497,47);
        Panel_21.addChild(Label_score);
        var Label_downscore=this.Label_downscore= UICtor.cLabel("100",25,cc.size(0,0),cc.color(126,49,2),0,0);
        Label_downscore.setPosition(689,47);
        Panel_21.addChild(Label_downscore);
        var Button_change=this.Button_change= UICtor.cBtn("res/ui/bjdmj/popup/extImg/matchImg_15.png");
        Button_change.setPosition(853,47);
        Panel_21.addChild(Button_change);


        this.addChild(Panel_21);



        UITools.addClickEvent(Button_change,this,this.onChange);

        this.setData(data)
    },

    onChange:function(){
        var mc = new ClubAgentProceedPop(0,this);
        PopupManager.addPopup(mc);
    },

    //显示数据
    setData:function(data){
        this.configId = data.configId || 0;
        this.modeMsg = data.modeMsg;
        this.myValue = data.myValue;
        this.maxValue = data.maxValue;
        //显示游戏和房间
        var createPara = data.modeMsg.split(",");
        var gameStr = ClubRecallDetailModel.getGameName(createPara) || "";
        this.Label_order.setString(""+data.seq);
        this.Label_name.setString(""+data.name);
        this.Label_score.setString(""+data.initValue);
        this.Label_downscore.setString(data.myValue + "-" + data.nextValue);
        this.Label_game.setString(""+gameStr);
        this.Label_downscore.setColor(cc.color(126 , 49 , 2));
        if (data.maxValueLog != data.maxValue){
            this.Label_downscore.setColor(cc.color(203 , 64 , 23));
        }
    },

    updateData:function(value){
        this.Label_downscore.setString(this.myValue + "-" + value);
    },

})