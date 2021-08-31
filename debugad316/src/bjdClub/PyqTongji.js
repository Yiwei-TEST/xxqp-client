/**
 * Created by cyp on 2019/3/18.
 */
var PyqTongji = BasePopup.extend({
    cytjCurPage:1,
    maxCytjItem:20,
    cytjItemArr:null,
    cytjData:null,
    ctor:function(){

        this.cytjData = [];
        this.jstjData = null;

        this._super("res/pyqTongji.json");
    },

    selfRender:function(){
        this.btn_cytj = this.getWidget("btn_cytj");
        this.btn_zsxh = this.getWidget("btn_zsxh");
        this.btn_zsxh.setBright(false);

        this.panel_cytj = this.getWidget("panel_cytj");
        this.panel_zsxh = this.getWidget("panel_zsxh");
        this.panel_zsxh.setVisible(false);

        UITools.addClickEvent(this.btn_cytj,this,this.onClickTopBtn);
        UITools.addClickEvent(this.btn_zsxh,this,this.onClickTopBtn);

        var btn_change_time = this.getWidget("btn_chang_time");
        UITools.addClickEvent(btn_change_time,this,this.onClickChangeTime);
        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.label_begin = this.getWidget("label_begin");
        this.label_end = this.getWidget("label_end");

        var scrollView_cytj = this.getWidget("scroll_cytj");
        scrollView_cytj.setBounceEnabled(true);

        var cygl_item = this.getWidget("item_cygl");
        cygl_item.setVisible(false);

        var item_zsxh = this.getWidget("item_zsxh");
        item_zsxh.setVisible(false);

        var todayTime = this.formartTimeStr(new Date().getTime());
        var beginTime = todayTime;
        var endTime = todayTime;

        this.label_begin.setString(beginTime);
        this.label_end.setString(endTime);

        this.btn_benzhou = this.getWidget("btn_benzhou");
        this.btn_search = this.getWidget("btn_search");
        UITools.addClickEvent(this.btn_benzhou,this,this.onClickBenzhou);
        UITools.addClickEvent(this.btn_search,this,this.onClickSearch);

        this.btn_dyj = this.getWidget("btn_dyj");
        this.btn_jf = this.getWidget("btn_jf");
        this.btn_cc = this.getWidget("btn_cc");

        UITools.addClickEvent(this.btn_dyj,this,this.onClickSortBtn);
        UITools.addClickEvent(this.btn_jf,this,this.onClickSortBtn);
        UITools.addClickEvent(this.btn_cc,this,this.onClickSortBtn);

        this.curSortBtn = this.btn_cc;
        this.isUp = true;
        this.updateSortBtnState();

        this.label_page = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page,this,this.onClickPageBtn);
        UITools.addClickEvent(this.btn_right_page,this,this.onClickPageBtn);

        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());

        this.getRankData();

    },

    onClickPageBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(sender == this.btn_left_page && this.cytjCurPage > 1){
            this.getRankData(this.cytjCurPage - 1);
        }else if(sender == this.btn_right_page && this.cytjCurPage < 25){
            this.getRankData(this.cytjCurPage + 1);
        }
    },

    onClickBenzhou:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var tempTime = new Date().getTime();
        var beginTime = new Date().getTime();
        var endTime = beginTime;
        for(var i = 0;i< 7;++i){
            var newDate = new Date(tempTime);
            if(newDate.getDay() == 1){
                beginTime = tempTime;
                break;
            }else{
                tempTime -= (60*60*24)*1000;
            }
        }

        this.label_begin.setString(this.formartTimeStr(beginTime));
        this.label_end.setString(this.formartTimeStr(endTime));

        this.getRankData();
    },

    onClickSearch:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.getRankData();
    },

    onClickSortBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(sender == this.curSortBtn){
            this.isUp = !this.isUp;
        }else{
            this.curSortBtn = sender;
            this.isUp = !this.curSortBtn.getChildByName("img_px").isFlippedY();
        }
        this.updateSortBtnState();
        this.getRankData();
    },

    updateSortBtnState:function(){
        var color1 = cc.color.YELLOW;
        var color2 = cc.color.WHITE;

        var btnArr = [this.btn_dyj,this.btn_jf,this.btn_cc];

        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].getChildByName("img_px").setColor(this.curSortBtn == btnArr[i]?color1:color2);
            if(this.curSortBtn == btnArr[i]){
                var img = "res/ui/bjdmj/popup/pyq/tongji/shang.png";
                if(!this.isUp)img = "res/ui/bjdmj/popup/pyq/tongji/xia.png";
                this.curSortBtn.getChildByName("img_px").loadTexture(img);
            }
        }

    },

    changeSearchTime:function(event){
        var data = event.getUserData();
        var beginTime = this.formartTimeStr(data.beginTime);
        var endTime = this.formartTimeStr(data.endTime);

        this.label_begin.setString(beginTime);
        this.label_end.setString(endTime);

        cc.sys.localStorage.setItem("sy_dn_beginTime",(beginTime));
        cc.sys.localStorage.setItem("sy_dn_endTime",(endTime));

        this.getRankData();
    },

    onClickTopBtn:function(sender){
        this.btn_cytj.setBright(sender == this.btn_cytj);
        this.btn_zsxh.setBright(sender == this.btn_zsxh);

        this.panel_cytj.setVisible(sender == this.btn_cytj);
        this.panel_zsxh.setVisible(sender == this.btn_zsxh);

        if(sender == this.btn_zsxh && !this.jstjData){
            this.getGamesCount();
        }
    },

    setCytjScroll:function(data){
        var scrollView = this.getWidget("scroll_cytj");
        var item = this.getWidget("item_cygl");

        this.cytjItemArr = this.cytjItemArr || [item];

        var spaceH = 165;
        var contentH = Math.max(scrollView.height,spaceH * (data.length));
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        for(var i = 0;i<data.length;++i){
            var newItem = this.cytjItemArr[i];
            if(!newItem){
                newItem = item.clone();
                this.cytjItemArr[i] = newItem;
                scrollView.addChild(newItem);
            }
            newItem.y = contentH - (i+0.5)*spaceH;
            newItem.visible = true;

            var label_idx = ccui.helper.seekWidgetByName(newItem,"idx_label");
            var img_head = ccui.helper.seekWidgetByName(newItem,"img_head");
            var user_name = ccui.helper.seekWidgetByName(newItem,"user_name");
            var user_id = ccui.helper.seekWidgetByName(newItem,"user_id");
            var jf_num = ccui.helper.seekWidgetByName(newItem,"jf_num");
            var cc_num = ccui.helper.seekWidgetByName(newItem,"cc_num");
            var dyj_num = ccui.helper.seekWidgetByName(newItem,"dyj_num");
            label_idx.setString(i + 1);
            this.showIcon(img_head,data[i].headimgurl);
            user_name.setString(data[i].userName);
            user_id.setString(data[i].userId);

            jf_num.setString(data[i].zjfCount || 0);
            cc_num.setString(data[i].djsCount || 0);
            dyj_num.setString(data[i].dyjCount || 0);

        }

        for(;i<this.cytjItemArr.length;++i){
            this.cytjItemArr[i].setVisible(false);
        }
    },

    sortCytjData:function(){
        var sortKey = "zjfCount";
        if(this.curSortBtn == this.btn_dyj){
            sortKey = "dyjCount";
        }else if(this.curSortBtn == this.btn_cc){
            sortKey = "dataValue";
        }

        for(var i = 0;i<this.cytjData.length;++i){
            for(var j = i+1;j<this.cytjData.length;++j){
                if(this.isUp){
                    if(this.cytjData[i][sortKey] < this.cytjData[j][sortKey]){
                        var temp = this.cytjData[i];
                        this.cytjData[i] = this.cytjData[j];
                        this.cytjData[j] = temp;
                    }
                }else{
                    if(this.cytjData[i][sortKey] > this.cytjData[j][sortKey]){
                        var temp = this.cytjData[i];
                        this.cytjData[i] = this.cytjData[j];
                        this.cytjData[j] = temp;
                    }
                }
            }
        }
    },

    setJstjScroll:function(data){
        var scrollView = this.getWidget("scroll_zsxh");
        var item = this.getWidget("item_zsxh");

        var listNum = data.length + 1;

        var spaceH = 165;
        var contentH = Math.max(scrollView.height,spaceH * (listNum));
        scrollView.setInnerContainerSize(cc.size(scrollView.width,contentH));

        this.panel_zsxh.getChildByName("label_no_data").setVisible(data.length<=0);

        var sum = 0;
        var sum1 = 0;
        for(var i = 0;i<listNum;++i){
            var newItem = item;
            if(i > 0){
                newItem = item.clone();
                scrollView.addChild(newItem);
            }
            newItem.y = contentH - (i+0.5)*spaceH;
            newItem.visible = true;

            var label_time = newItem.getChildByName("time_label");
            var label_js = newItem.getChildByName("zsxh_label");
            var label_cc = newItem.getChildByName("cc_label");

            if(i == listNum - 1){
                label_time.setString("合计");
                label_js.setString(sum);
                label_cc.setString(sum1);
            }else{
                label_time.setString(data[i].ctime);
                label_js.setString(data[i].c);
                label_cc.setString(data[i].decDiamond || 0);

                sum += parseInt(data[i].c);
                sum1 += parseInt(data[i].decDiamond || 0);
            }
        }
    },

    showIcon: function (imgNode,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        var spr = imgNode.getChildByName("icon_spr");
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(100/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(100/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClickChangeTime:function(){
        var beginTime = this.getLocalItem("sy_dn_beginTime") || 0;
        var endTime = this.getLocalItem("sy_dn_endTime") || 0;
        var mc = new ClubChoiceTimePop(this , beginTime , endTime,3);
        PopupManager.addPopup(mc);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    /**
     * 局数排行榜
     */
    getRankData:function(page){
        page = page || 1;
        var rankType = "djsCount,zjfCount,dyjCount";
        if(this.curSortBtn == this.btn_dyj){
            rankType = "dyjCount,djsCount,zjfCount";
        }else if(this.curSortBtn == this.btn_jf){
            rankType = "zjfCount,djsCount,dyjCount";
        }

        sy.scene.showLoading("正在获取统计数据");
        var self = this;

        NetworkJT.loginReq("dataAction", "loadGroupDataRank", {startDate:this.label_begin.getString(), endDate : this.label_end.getString(),orderRule:this.isUp?"desc":"asc",
            dataCode:"group" + ClickClubModel.getCurClubId() , dataTypes:rankType , pageNo:page , pageSize:this.maxCytjItem , returnOne:1}, function (data) {
            sy.scene.hideLoading();
            if (data) {
                //cc.log("=========getRankData=============" + JSON.stringify(data));
                var tempData = data[rankType];
                var label_no_data = self.panel_cytj.getChildByName("label_no_data");
                label_no_data.setVisible(false);
                if(tempData.length > 0){
                    self.cytjData = tempData;
                    self.cytjCurPage = page;
                    self.label_page.setString(page);
                }else{
                    if(page == 1){
                        label_no_data.setVisible(true);
                    }else{
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }
                self.setCytjScroll(self.cytjData);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },

    handleRankData:function(data){
        var djsData = data["djsCount"];
        var dyjData = data["dyjCount"];
        var zjfData = data["zjfCount"];

        if(dyjData){
            for(var i = 0;i<djsData.length;++i){
                djsData[i]["dyjCount"] = 0;
                for(var j = 0;j<dyjData.length;++j){
                    if(dyjData[j].userId == djsData[i].userId){
                        djsData[i]["dyjCount"] = dyjData[j].dataValue;
                        break;
                    }
                }
            }
        }

        if(zjfData){
            for(var i = 0;i<djsData.length;++i){
                djsData[i]["zjfCount"] = 0;
                for(var j = 0;j<zjfData.length;++j){
                    if(zjfData[j].userId == djsData[i].userId){
                        djsData[i]["zjfCount"] = zjfData[j].dataValue;
                        break;
                    }
                }
            }
        }

        return djsData;
    },

    getGamesCount:function(){
        var self = this;
        sy.scene.showLoading("正在获取局数统计数据");
        NetworkJT.loginReq("groupActionNew", "loadTableCount", {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId}, function (data) {
            if (data) {
                //cc.log("===========getGamesCount=============="+JSON.stringify(data));
                sy.scene.hideLoading();
                self.jstjData = data.message.list;
                self.setJstjScroll(data.message.list);

            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },


    formartTimeStr:function(shijianchuo){
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        m = m < 10 ? "0" + m : "" + m;
        var d = time.getDate();
        d = d < 10 ? "0" + d : "" + d;
        //var h = time.getHours();
        //var mm = time.getMinutes();
        //var s = time.getSeconds();
        return y+m+d;
    },
});