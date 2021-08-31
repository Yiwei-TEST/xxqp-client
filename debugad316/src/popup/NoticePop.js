/**
 * Created by Administrator on 2016/6/27.
 */

var NoticePop = BasePopup.extend({

    ctor: function (temp) {
        this.fristTemp = temp || 0;
        this._super("res/notice.json");
    },

    selfRender: function () {
        this.img_content = this.getWidget("img_content");
        this.ListView_content = this.getWidget("ListView_content");
        this.label_content = this.getWidget("Label_17");

        this.updateContent = UpdateNoticeModel.getNoticeContent();
        this.label_content.setString(""+this.updateContent);

        var btnNameArr = ["btn_zzsm","btn_bind_phone","btn_waigua","btn_gxgg"];
        this.btnArr = [];
        for(var i = 0;i<btnNameArr.length;++i){
            this.btnArr[i] = this.getWidget(btnNameArr[i]);
            UITools.addClickEvent(this.btnArr[i],this,this.onClickItemBtn);
        }

        this.updateBtnState(this.btnArr[this.fristTemp]);

    },

    onClickItemBtn:function(sender){
        this.updateBtnState(sender);
    },

    getContentImg:function(name){
        var img = "";
        switch(name){
            case "btn_bind_phone":
                img = "res/ui/notice/notice_img_bangdingshouji.jpg";
                break;
            case "btn_waigua":
                img = "res/ui/notice/notice_img_waiguaxuanshang.jpg";
                break;
            case "btn_zzsm":
                img = "res/ui/notice/notice_img_zhengxhongshenming.jpg";
                break;
            default :
                img = "res/ui/notice/notice_img_bangdingshouji.jpg";
                break;
        }
        return img;
    },

    updateBtnState:function(btn){
        var color1 = cc.color("#b23b00");
        var color2 = cc.color("#876023");

        var btnTemp = 0;
        for(var i = 0;i<this.btnArr.length;++i){
            this.btnArr[i].setBright(this.btnArr[i] == btn);
            this.btnArr[i].getChildByName("label_txt").setColor(this.btnArr[i] == btn?color1:color2);
            if (this.btnArr[i] == btn){
                btnTemp = i;
            }
        }

        if (btnTemp <= 2){
            this.ListView_content.visible = false;
            this.img_content.visible = true;
            this.img_content.loadTexture(this.getContentImg(btn.getName()));
        }else{
            this.ListView_content.visible = true;
            this.img_content.visible = false;
        }
    },
});

var NewNoticePop = BasePopup.extend({

    ctor: function (temp) {
        this.fristTemp = temp || 0;
        this._super("res/newNotice.json");
    },

    selfRender: function () {
        this.img_content = this.getWidget("img_content");
        this.ListView_content = this.getWidget("ListView_content");
        this.label_content = this.getWidget("Label_17");

        this.updateContent = UpdateNoticeModel.getNoticeContent();
        this.label_content.setString(""+this.updateContent);

        var btnNameArr = ["btn_waigua","btn_zzsm","btn_gxgg"];
        this.btnArr = [];
        for(var i = 0;i<btnNameArr.length;++i){
            this.btnArr[i] = this.getWidget(btnNameArr[i]);
            UITools.addClickEvent(this.btnArr[i],this,this.onClickItemBtn);
        }

        this.updateBtnState(this.btnArr[this.fristTemp]);

    },

    onClickItemBtn:function(sender){
        this.updateBtnState(sender);
    },

    updateBtnState:function(btn){
        var color1 = cc.color("#b23b00");
        var color2 = cc.color("#876023");

        var btnTemp = 0;
        for(var i = 0;i<this.btnArr.length;++i){
            this.btnArr[i].setBright(this.btnArr[i] == btn);
            this.btnArr[i].getChildByName("label_txt").setColor(this.btnArr[i] == btn?color1:color2);
            if (this.btnArr[i] == btn){
                btnTemp = i;
            }
        }

        if (btnTemp == 0){
            this.ListView_content.visible = false;
            this.img_content.visible = true;
        }else{
            if(btnTemp == 1){
                var label = " 一、游戏的结算积分仅为记录，且仅限本人使用。不具有任何\n"+"货币价值；\n" +
                " 二、游戏中的钻石/元宝/房卡/乐豆为游戏道具，仅作为开设\n"+"游戏房间使用；\n" +
                    " 三、游戏内不提供任何形式的官方回购、游戏内道具不具有\n"+"任何财产性功能；\n\n" +
                    "      愿广大玩家一起营造健康文明律师的游戏环境，远离赌博。";
                this.label_content.setString("" + label);
                this.label_content.setColor(cc.color(255,255,255));
                
            }else{
                this.label_content.setString(""+this.updateContent);
            }
            this.ListView_content.visible = true;
            this.img_content.visible = false;
        }
    },
});

var HuodongPop = BasePopup.extend({
    ctor:function(){
        this._super("res/huodongPop.json");
    },

    selfRender:function(){

    },
});