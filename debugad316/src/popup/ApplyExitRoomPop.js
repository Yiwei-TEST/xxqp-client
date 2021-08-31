/**
 * Created by fc on 2017/6/30.
 * */
var ApplyExitRoomPop = BasePopup.extend({
    players:[],
    ctor: function (gameType) {
        this.gameType = gameType || 1;
        this.dt = 0;
        this.json = "res/applyExitRoom.json";
        this._super(this.json);
    },

    selfRender: function () {
        
        this.players = BaseRoomModel.curRoomData.players;
        var num = BaseRoomModel.curRoomData.renshu;
        if(this.gameType == 2){
            this.players = PHZRoomModel.players;
            num = PHZRoomModel.players;
        }else if(this.gameType == 1){
            this.players = DTZRoomModel.players;
            num = DTZRoomModel.renshu;
        }else if(this.gameType == 3){
            this.players = PDKRoomModel.players;
            num = PDKRoomModel.renshu;
        }else if(this.gameType == 225 || this.gameType == 221|| this.gameType == 193){
            this.players = MJRoomModel.players;
            num = MJRoomModel.renshu;
        }else if(this.gameType == 223){
            this.players = MJRoomModel.players;
            num = MJRoomModel.renshu;
        }
        this.listener = SyEventManager.addEventListener(SyEvent.DISAGREE_APPLYEXITROOM,this,this.removeCurrentPop);
        this.Button_36 = this.getWidget("Button_36");
        this.Button_37 = this.getWidget("Button_37");
        this.label_time = this.getWidget("label_time");
        this.time = ApplyExitRoomModel.timeStr;
        this.label_time.setString(this.time);


        for(var i=1;i <= 4;i++){
            this["name"+i] = this.getWidget("name"+i);
            this["icon"+i] = this.getWidget("icon"+i);
            this["ty"+i] = this.getWidget("ty"+i);
            this["name"+i].visible = this["icon"+i].visible = this["ty"+i].visible = false;
        }

        var offX = 100;
        if(num == 3){
            for(var i = 1 ; i <= 3 ; i++){
                this["name"+ i].x = this["name"+ i].x + offX;
                this["icon"+ i].x = this["icon"+ i].x + offX;
                this["ty"+ i].x = this["ty"+ i].x + offX;
            }
        }


        
        if(!ApplyExitRoomModel.fal){
            this.Button_36.visible = this.Button_37.visible = false;
            //this.label_time.y = 80;
        }else{
            this.Button_36.visible = this.Button_37.visible = true;
            UITools.addClickEvent(this.Button_36,this,this.onOk);
            UITools.addClickEvent(this.Button_37,this,this.onCancel);
        }
        // cc.log("DTZRoomModel.players.length.." , this.players.length);
        for(var i = 1 ; i <= this.players.length ; i++) {

            if(((BaseRoomModel.curRoomData.wanfa == GameTypeEunmPK.CDTLJ && CDTLJRoomModel.isFzbHide())
                || (BaseRoomModel.curRoomData.wanfa == GameTypeEunmPK.XTSDH && SDHRoomModel.isFzbHide()))
                && this.players[i - 1].userId != PlayerModel.userId){
                this.players[i - 1].name = "玩家" + i;
                this.players[i-1].icon = "res/res_icon/icon_fang.png";
            }

            this["name" + i].visible = this["icon" + i].visible = this["ty" + i].visible = true;
            var nameStr = this.players[i - 1].name;
            nameStr = UITools.truncateLabel(nameStr,5);
            this["name" + i].setString(nameStr);
            cc.log("ApplyExitRoomModel.array..." , JSON.stringify(ApplyExitRoomModel.array));
            for (var j = 0; j < ApplyExitRoomModel.array.length; j++) {
                if (this.players[i - 1].userId ==  parseInt(ApplyExitRoomModel.array[j][0])){
                    var state = parseInt(ApplyExitRoomModel.array[j][1]);//2表示申请，1表示同意，0表示等待
                    cc.log("解散房间各个玩家的状态值... state..." , state)
                    if(state == 2){
                        this.name = this.players[i-1].name;
                    }else if(state == 1){
                        this["ty"+i].visible = true;
                        this["ty"+i].setString("同意");
                        this.tyNum += 1;
                        //this.updateBar();
                    }else if(state == 0){
                        this["ty"+i].visible = true;
                        this["ty"+i].setString("等待中");
                        this["ty"+i].setColor(cc.color("d87308"));
                    }
                    break;
                }
            }
            this.showIcon(this["icon"+i],this.players[i-1].icon,this.players[i-1].sex);
        }
        this.Panel_13 = this.getWidget("Panel_13");
        var elements = [];
        elements.push(RichLabelVo.createTextVo("玩家",cc.color("7E3102"),42));
        var nameStr = this.name;
        nameStr = UITools.truncateLabel(nameStr,5);
        elements.push(RichLabelVo.createTextVo(nameStr,cc.color("4974c9"),42));
        elements.push(RichLabelVo.createTextVo("申请解散房间，全部玩家同意后房间会被解散",cc.color("7E3102"),42));
        var richLabel = new RichLabel(cc.size(1340,0),3);
        richLabel.setLabelString(elements);
        richLabel.x = 10;
        richLabel.y = 20;
        this.Panel_13.addChild(richLabel);
        this.scheduleUpdate();

        //切后台这个界面先清除，重连回来后通过推送的消息重新弹出
        this.hideListener = cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
            this.removeCurrentPop();
        }.bind(this));

    },

    showIcon:function(parent,url,sex){
        var defaultimg = (sex==1) ? "res/ui/bjdmj/popup/applyExitroom/default_m.png" : "res/ui/bjdmj/popup/applyExitroom/default_m.png";
        if(parent.getChildByTag(345))
            parent.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = 66;
        sprite.y = 66;
        parent.addChild(sprite,5,345);
        if(url){
            cc.loader.loadImg(url, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = 66;
                    sprite.y = 66;
                }
            });
        }
    },

    onExit:function(){
        cc.eventManager.removeListener(this.hideListener);

        this._super();
    },

    onOk:function(){
        sySocket.sendComReqMsg(8,[1]);
        //PopupManager.remove(this);
        this.removeCurrentPop();
    },

    onCancel:function(){
        sySocket.sendComReqMsg(8,[2]);
        //PopupManager.remove(this);
        this.removeCurrentPop();
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt>=1){
            this.dt = 0;
            if(ApplyExitRoomModel.time>0){
                ApplyExitRoomModel.reduceTimeBySecond();
                this.time = ApplyExitRoomModel.getTimeStr();
                this.label_time.setString(this.time);
            }else{
                this.unscheduleUpdate();
                //PopupManager.remove(this);
                this.removeCurrentPop();
            }
        }
    },

    removeCurrentPop:function(){
        ApplyExitRoomModel.isShow = false;
        this.unscheduleUpdate();
        SyEventManager.removeListener(this.listener);
        this.removeFromParent(true);
    },
});
