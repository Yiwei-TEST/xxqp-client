/**
 * 俱乐部邀请弹框
 */
var ClubRoomModel = {
    clickClubRoomType:0,

    isDtz:function(){
        return this.clickClubRoomType == 1;
    }
}

var ClubRoomDetailPop = BasePopup.extend({

    ctor:function(detailData){
        cc.log("detailData::" , JSON.stringify(detailData));
        this.clubId = detailData.strParams[0];
        this.roomKeyId = detailData.strParams[1];
        this.memberData = JSON.parse(detailData.strParams[2]) || [];
        this.rankNum = detailData.params[0];
        this._super("res/clubRoomDetailPop.json");
    },

    selfRender:function(){
        //初始化结点
        for(var index = 1 ; index <= 4 ; index++){
            var name = "lbName" + (index);
            var id = "lbId" + (index);
            var rank = "lbRank" + (index);
            var score = "lbScore" + (index);
            var icon = "icon" + (index);
            var state = "outLine" + (index);
            var tzScore = "lbtzScore" + (index);
            this[name] = this.getWidget(name);
            this[id] = this.getWidget(id);
            this[rank] = this.getWidget(rank);
            this[score] = this.getWidget(score);
            this[icon] = this.getWidget(icon);
            this[state] = this.getWidget(state);
            this[tzScore] = this.getWidget(tzScore);

            if(this[icon]){
                cc.log("node false::icon" + index);
                this[icon].visible = false;
                this[state].visible = false;
            }

            if(!ClubRoomModel.isDtz()){
                this[score].x = this[score].x + 80;
            }
        }

        if(!ClubRoomModel.isDtz()){
            this.getWidget("title4").visible = false;
            this.getWidget("title3").loadTexture("res/ui/bjdmj/popup/extImg/titlecurScore.png");
            this.getWidget("title3").x = this.getWidget("title3").x + 80;
        }

        for(var index = 1 ; index <= this.memberData.length ; index++){
            cc.log("node true::icon" + index , this.memberData[index-1]);
            var tMemberData = JSON.parse(this.memberData[index-1]);
            //cc.log("tMemberData::" , tMemberData.name , tMemberData["name"]);
            if(this["icon"+index]){
                this["icon"+index].visible = true;
            }

            this["lbRank"+index].setString("" + this.rankNum);
            this["lbName"+index].setString("" + tMemberData.name);
            var idStr = tMemberData.userId;
            if (!ClickClubModel.isClubCreaterOrLeader()){
                idStr = UITools.dealUserId(idStr);
            }
            this["lbId"+index].setString("ID:" + idStr);
            this["lbScore"+index].setString("" + tMemberData.score);
            if(ClubRoomModel.isDtz()){
                this["lbtzScore"+ index].setString("" + tMemberData.tzScore);
            }else{
                this["lbtzScore"+ index].visible = false;
            }


            this.showIcon(this["icon" + index], tMemberData.headimgurl);
            if(tMemberData.online == 0){
                this["outLine"+index].visible = true;
            }
        }
    },

    showIcon: function (iconBg,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if (iconBg.getChildByTag(345)) {
            iconBg.removeChildByTag(345);
        }
        //var sprite = new cc.Sprite(defaultimg);
        //sprite.x = iconBg.width * 0.5;
        //sprite.y = iconBg.height * 0.5;
        //sprite.scale = 0.83;

        var sten=new cc.Sprite("res/ui/bjdmj/popup/extImg/icon.png");
        var clipnode = new cc.ClippingNode();
        clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:iconBg.width * 0.5+0.25,y:iconBg.height * 0.5-0.25,alphaThreshold:0.8});
        var sprite = new cc.Sprite("res/ui/common/default_m.png");
        sprite.scale = 0.795;
        clipnode.addChild(sprite);

        iconBg.addChild(clipnode, 5, 345);
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
    }
});

