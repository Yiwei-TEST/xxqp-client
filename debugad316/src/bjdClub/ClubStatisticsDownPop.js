/**
 * Created by Administrator on 2017/7/21.
 */

/**
 * 成员统计弹框
 */
var ClubStatisticsDownPop = BasePopup.extend({

    ctor:function(itemData,root,temp){
        this.targetUserId = itemData.userId || 0;
        this.curTemp = temp || 1;//1是查看下级 2是查看比赛分
        this.cytjData = [];
        this._super("res/clubStatisticsDownPop.json");
    },

    selfRender:function(){

        this.membegImgLoad = new RemoteImageLoadQueue();
        this.scheduleUpdate();

        this.item_cygl = this.getWidget("item_cygl");
        this.item_cygl.visible = false;


        //当前页码 , 最大页码
        this.rankParams = {};
        this.curRankPage = 1;
        this.maxRankPageSize = 25; //当前最多显示多少条数据

        this.lbNoData = this.getWidget("labelNoData");


        this.lbDataPage = this.getWidget("lbDataPage");
        this.lbDataPage.setString("1");

        this.btn_left_page = this.getWidget("btnDataLeft");
        this.btn_right_page = this.getWidget("btnDataRight");
        UITools.addClickEvent(this.btn_left_page,this,this.onClickPageBtn);
        UITools.addClickEvent(this.btn_right_page,this,this.onClickPageBtn);


        UITools.addClickEvent(this.touchPanel , this , this.onOpenChoiceTimePop);
        UITools.addClickEvent(this.openChoiceTime , this , this.onOpenChoiceTimePop);
        //this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);


        var qyqid = this.getWidget("label_qyq_id");
        qyqid.setString("亲友圈ID:" + ClickClubModel.getCurClubId());


        this.touchPanel = this.getWidget("dataTouchPanel");
        this.touchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.touchPanel , this , this.onOpenSingleTimePop);
        //以当前时间 或者上一次的查看时间来获取数据
        var timeEnd = new Date();
        this.endTimeLabel = this.getWidget("endTime");
        this.endTime = this.formartTimeStr(timeEnd.getTime());
        this.endTimeLabel.setString(UITools.formatTime(timeEnd));


        var inputBg =  this.getWidget("input_bg");
        inputBg.visible = false;
        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 90, inputBg.height - 10),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2 - 40;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.inputBox.setPlaceHolder("请输入关键词");
        this.inputBox.setPlaceholderFont("Arial",36);
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("Arial",36);


        this.addCustomEvent(SyEvent.RESET_SINGLE_TIME, this, this.changeSingleTime);

        this.getClubCommissionLogNextLevel(1);
    },

    onClickPageBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        if(sender == this.btn_left_page && this.curRankPage > 1){
            this.getClubCommissionLogNextLevel(this.curRankPage - 1);
        }else if(sender == this.btn_right_page && this.curRankPage < 25){
            this.getClubCommissionLogNextLevel(this.curRankPage + 1);
        }
    },

    onOpenSingleTimePop:function(){
        var endTime = this.getLocalItem("sy_statistics_endTime") || 0;
        var mc = new ClubSingleTimePop(this  , endTime,3);
        PopupManager.addPopup(mc);
    },

    changeSingleTime:function(event){
        var data = event.getUserData();
        this.endTime = this.formartTimeStr(data.endTime);
        cc.sys.localStorage.setItem("sy_statistics_endTime",(this.endTime));
        this.endTimeLabel.setString(UITools.formatTime(data.endTime));
        this.getClubCommissionLogNextLevel(this.curRankPage)
    },

    /**
     * 获取新的成员信息
     */
    getClubCommissionLogNextLevel:function(curPage){
        cc.log("============getClubCommissionLogNextLevel===========");
        var curPage = curPage || 1;
        var curTargetUserId = this.targetUserId || "";
        this.membegImgLoad.stopLoad();
        var self = this;

        //cc.log("self.endTime==",self.endTime)
        sy.scene.showLoading("正在获取成员数据");
        var params = {
            sessCode:PlayerModel.sessCode,
            groupId:ClickClubModel.getCurClubId(),
            dataDate:""+self.endTime,
            pageNo:curPage,
            pageSize:self.maxRankPageSize,
            queryUserId:self.inputBox.getString(),
            userId:PlayerModel.userId,
            targetUserId:curTargetUserId

        }

        NetworkJT.loginReq("groupActionNew", "commissionLogNextLevel",params , function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                cc.log("commissionLogNextLevel::"+JSON.stringify(data));
                if(data.message.dataList.length > 0){
                    self.cytjData = data.message.dataList;
                    self.curRankPage = curPage;
                    self.lbDataPage.setString(curPage);
                }else{
                    if (curPage == 1){
                        self.cytjData = data.message.dataList;
                    }
                    FloatLabelUtil.comText("没有更多数据了");
                }
                self.setCytjScroll(self.cytjData);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },


    setCytjScroll:function(data){
        var scrollView = this.getWidget("item_scroll_cygl");
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
            //selfWinCredit 输赢信用分
            //   selfCommissionCredit 赠送分
            //   selfCommissionCount 赠送次数
            //   selfZjsCount 总局数
            //   selfDyjCount 大赢家数
            //   selfTotalPay 总消耗
            var img_head = ccui.helper.seekWidgetByName(newItem,"img_head");
            var user_name = ccui.helper.seekWidgetByName(newItem,"user_name");
            var user_id = ccui.helper.seekWidgetByName(newItem,"user_id");
            var user_status = ccui.helper.seekWidgetByName(newItem,"user_status");

            var Image_consume = ccui.helper.seekWidgetByName(newItem,"Image_consume");
            var user_consume = ccui.helper.seekWidgetByName(Image_consume,"user_consume");
            var user_winNum = ccui.helper.seekWidgetByName(newItem,"user_winNum");
            var user_dyjNum = ccui.helper.seekWidgetByName(newItem,"user_dyjNum");
            var user_rcNum = ccui.helper.seekWidgetByName(newItem,"user_rcNum");


            this.showIcon(img_head,data[i].headimgurl);

            user_name.setString(UITools.truncateLabel(data[i].userName,5));
            user_id.setString(data[i].userId);
            //
            //dyj_num.setString(data[i].selfDyjCount || 0);
            //
            //var selfTotalPay = MathUtil.toDecimal((data[i].selfTotalPay || 0)/100);
            //zxh_num.setString("" + selfTotalPay);

            user_status.setString(ClickClubModel.getClubRoleName(data[i].userRole,data[i].promoterLevel));
            //cc.log("panelItem.curLevel",JSON.stringify(data[i]))

            var creditNum = MathUtil.toDecimal((data[i].credit || 0)/100);
            var winNum = MathUtil.toDecimal((data[i].selfTotalPay || 0)/100);
            var dyjNum = data[i].selfDyjCount || 0;

            user_winNum.setString(""+winNum);
            user_consume.setString("" + creditNum);
            user_dyjNum.setString("" + dyjNum);
            user_rcNum.setString("" + data[i].selfZjsCount || 0);

        }

        for(;i<this.cytjItemArr.length;++i){
            this.cytjItemArr[i].setVisible(false);
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
            this.membegImgLoad.push(iconUrl, function (img) {
                spr.setTexture(img);
                spr.setScale(100/spr.width);
            });
        }else{
            spr.initWithFile(defaultimg);
        }
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

    update: function(dt) {
        this.membegImgLoad.update(dt);
    },

    onClose:function(){
        this.membegImgLoad.stopLoad();
        this.unscheduleUpdate();
        this._super();
    }

});



