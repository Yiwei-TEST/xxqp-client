/**
 * Created by cyp on 2019/3/16.
 */
var PyqWanfa = BasePopup.extend({
    type:1,
    bagData:null,
    ctor:function(bagData){

        this.bagData = bagData;

        this.type = type || 1;

        this._super("res/pyqWanfa.json");
    },

    selfRender:function(){
        this.panel_create = this.getWidget("panel_create");
        this.panel_join = this.getWidget("panel_join");
        this.btn_createNew = this.getWidget("btn_createNew");

        UITools.addClickEvent(this.btn_createNew,this,this.onClickCreateNew);

        this.panel_create.setVisible(this.type != 1);
        this.panel_join.setVisible(this.type == 1);

        if(this.type == 1){
            this.getWidget("title").loadTexture("res/ui/bjdmj/popup/pyq/wanfa/kuaisu.png");
        }

        this.showScrollItem();

    },

    showScrollItem:function(){
        if(this.type == 1){
            var scrollView = this.getWidget("join_scroll");
            var item = this.getWidget("item_join");
        }else{
            var scrollView = this.getWidget("create_scroll");
            var item = this.getWidget("item_create");
        }

        var itemNum = 5;
        var spaceH = 106;

        var contentH = Math.max(scrollView.height,itemNum*spaceH + 10);
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        for(var i = 0;i<itemNum;++i) {
            var newItem = item;
            if (i > 0) {
                newItem = item.clone();
                scrollView.addChild(newItem);
            }
            item.y = contentH - (i + 0.5)*spaceH - 10;
            this.setItemInfo(item,i);
        }
    },

    setItemInfo:function(item,i){
        item.getChildByName("idx_label").setString(i+1);
        item.getChildByName("table_name").setString("包厢名：长麻1分");
        item.getChildByName("game_name").setString("游戏：长沙麻将 4人");
        item.getChildByName("wanfa_label").setString("16局 假将胡 捉2鸟 捉鸟乘法 四喜 六六顺 板板胡");


        var btn_guanbi = ccui.helper.seekWidgetByName(item,"btn_guanbi");
        var btn_xiugai = ccui.helper.seekWidgetByName(item,"btn_xiugai");

        if(this.type == 1){
            var btn_kuaisu = ccui.helper.seekWidgetByName(item,"btn_join");
            UITools.addClickEvent(btn_guanbi,this,this.onClickQuickStart);
            btn_kuaisu.tempData = i+1;
        }else{
            var btn_guanbi = ccui.helper.seekWidgetByName(item,"btn_guanbi");
            var btn_xiugai = ccui.helper.seekWidgetByName(item,"btn_xiugai");
            UITools.addClickEvent(btn_guanbi,this,this.onClickGuanbi);
            UITools.addClickEvent(btn_guanbi,this,this.onClickXiugai);
            btn_guanbi.tempData = i+1;
            btn_xiugai.tempData = i+1;
        }

    },

    onClickCreateNew:function(){

    },

    onClickQuickStart:function(){

    },

    onClickGuanbi:function(){

    },

    onClickXiugai:function(){

    },

});