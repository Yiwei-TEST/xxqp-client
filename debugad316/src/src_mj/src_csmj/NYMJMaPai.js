/**
 * Created by Administrator on 2020/2/29.
 */
var NYMJMaPaiPop = BasePopup.extend({

    ctor: function (data) {
        this.data = data;
        this._super("res/nymjMaPai.json");
    },



    selfRender: function () {
        this.labelStr = this.getWidget("labelStr");//显示数字
        this.Panel_maPai = this.getWidget("bgMa");//显示数字
        //显示鸟牌
        this.showBirds();
    },

    showBirds: function() {
        var players = this.data.closingPlayers;
        var birdList = this.data.birdAttr || [];

        var huSeat = -1;
        for(var i = 0;i < players.length;++i){
            if(players[i].isHu){
                huSeat = players[i].seat;
                break;
            }
        }
        if (birdList){
            var self = this;
            var i = 1;
            var mashu = 0;
            self.labelStr.setString("×"+0);
            var MJ6 = this.getWidget("Image_6");
            this.schedule(function(){
                var id = birdList[i - 1].mjId;
                var mj = MJAI.getMJDef(id);
                if(!mj){
                    return;
                }
                if(MJRoomModel.intParams[11] == 1){//选了一马
                    if(mj.c == 201){
                        mashu = 1;
                    }else{
                        mashu = mj.n == 1 ? 10 : mj.n;
                    }
                }else{
                    if(huSeat === birdList[i - 1].awardSeat){
                        ++mashu;
                    }
                }
                var card = new CSMahjong(MJAI.getDisplayVo(1, 2), mj);
                //var size = card.getContentSize();
                //var _scale = 0.7;
                //card.scale = _scale;
                card.x = MJ6.x;
                card.y = MJ6.y;
                card.setAnchorPoint(0.5,0.5);
                self.Panel_maPai.addChild(card);
                var localMJ = self.getWidget("Image_" + i);
                var move = cc.moveTo(0.25,cc.p(localMJ.x,localMJ.y));
                var func = cc.CallFunc(function(){
                    self.labelStr.setString("×"+(mashu));
                });
                card.runAction(cc.sequence(move,func));
                ++i;
            },0.4,birdList.length - 1,0.1);
        }
    },

});

