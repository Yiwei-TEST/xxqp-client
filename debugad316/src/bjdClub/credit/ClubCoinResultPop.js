/**
 * Created by zyq on 2019/12/6.
 */
var ClubCoinResultPop = cc.Layer.extend({
    ctor: function (data) {
        this.data = data
        cc.log("CLUB_RESULT_COIN2",JSON.stringify(data))
        this._super();
        this.showConfig()
    },

    showConfig: function () {

        var grayLayer = this.grayLayer = new cc.LayerColor(cc.color(0,0,0,120),cc.winSize.width,cc.winSize.height);
        this.addChild(grayLayer);

        //全屏适配后，宽屏手机弹窗边上的地方点击会透传，用这个屏蔽下
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){
                if(this.isVisible())return true;
                return false;
            }.bind(this)
        }),grayLayer);

        var spaceHeight = 130;

        this.resultBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/club_bg_frame_1.png", null, cc.rect(45, 45, 50, 50));
        this.resultBg.setPosition(cc.winSize.width/2,cc.winSize.height/2)
        this.resultBg.width = 1180;
        this.addChild(this.resultBg);
        this.resultBg.height = (spaceHeight+10) * this.data.length + 100;

        var btn_close = new ccui.Button("res/ui/bjdmj/popup/x.png");
        btn_close.setPosition(this.resultBg.width-10,this.resultBg.height-10);
        this.resultBg.addChild(btn_close);
        UITools.addClickEvent(btn_close,this,this.onClickCloseBtn);

        for(var i = this.data.length-1; i >= 0; i--){
            var itemBg = new cc.Scale9Sprite("res/ui/bjdmj/popup/pyq/club_bg_frame_2.png", null, cc.rect(20, 20, 7, 7));
            this.resultBg.addChild(itemBg);
            itemBg.setAnchorPoint(cc.p(0.5,0))
            itemBg.width = 1100;
            itemBg.height = spaceHeight;
            itemBg.setPosition(this.resultBg.width/2,70 + (spaceHeight+10)*i)

            var defaultimg = "res/ui/bjdmj/popup/pyq/default_m.png";
            var Image_head = new cc.Sprite(defaultimg);
            Image_head.setPosition(100, 0+itemBg.height/2);
            itemBg.addChild(Image_head);
            if(this.data[i].icon){
                cc.loader.loadImg(this.data[i].icon, {width: 78, height: 78}, function (error, img) {
                    if (!error) {
                        Image_head.setTexture(img);
                    }
                });
            }

            var Label_name = UICtor.cLabel("爱吃鱼的猫",38,cc.size(300,38),cc.color("#6f1816"),0,0);
            Label_name.setAnchorPoint(0,0.5);
            Label_name.setPosition(cc.p(160, 22+itemBg.height/2));
            itemBg.addChild(Label_name);
            Label_name.setString(""+this.data[i].name)

            var Label_id = UICtor.cLabel("100",38,cc.size(0,0),cc.color("#6f1816"),0,0);
            Label_id.setAnchorPoint(0,0.5);
            Label_id.setPosition(cc.p(Label_name.x, -22+itemBg.height/2));
            itemBg.addChild(Label_id);
            Label_id.setString("ID:"+this.data[i].userId)

            var label = UICtor.cLabel("金币：",38,cc.size(0,0),cc.color("#6f1816"),0,0);
            label.setPosition(cc.p(180+itemBg.width/2, 0+itemBg.height/2));
            itemBg.addChild(label);

            var color = cc.color("#4e5aa2")
            var coin = this.data[i].coin
            if(this.data[i].coin >= 0){
                color = cc.color("#ff0000")
                coin = "+"+ this.data[i].coin
            }
            var Label_coin = UICtor.cLabel("100",38,cc.size(0,0),color,0,0);
            Label_coin.setPosition(cc.p(230+itemBg.width/2, 0+itemBg.height/2));
            Label_coin.setAnchorPoint(cc.p(0,0.5))
            itemBg.addChild(Label_coin);
            Label_coin.setString(""+coin)

        }
    },
    onClickCloseBtn:function(){
        this.removeFromParent(true);
    }
})