/**
 * Created by cyp on 2020/1/2.
 */

var XTBPSmallResultLayer = SDHSmallResultLayer.extend({

    addPiaoImg:function(data){
        for(var i = 0;i<data.length;++i){
            var piao = new cc.Sprite("res/res_sdh/imgPiao/icon_piao_" + data[i] + ".png");
            piao.setScale(0.8);

            var pos = this.userScoreArr[i].convertToWorldSpace(cc.p(0,this.userScoreArr[i].height/2));
            pos = this.layerBg.convertToNodeSpace(pos);
            pos.x += (i==0?250:110);

            piao.setPosition(pos);
            this.layerBg.addChild(piao,1);
        }
    },

    setLayerWithData:function(){
        this._super();

        if(!this.msgData)return;

        var piaoData = [];

        var players = this.msgData.closingPlayers || [];

        var hasZhuang = false;
        for(var i = 0;i<players.length;++i){
            if(players[i].boom == 1){
                hasZhuang = true;
                break;
            }
        }
        var idx = hasZhuang?1:0;
        var curIdx = 0;
        for(var i = 0;i<players.length;++i){
            var p = players[i];
            if(p.boom == 1){//庄家
                curIdx = 0;
            }else{
                curIdx = idx;
                idx++;
            }
            if(p.ext[0] >= 0){
                piaoData[curIdx] = p.ext[0];
            }
        }

        this.addPiaoImg(piaoData);

    },

    showRuleInfo:function(){
        var str = ClubRecallDetailModel.getXTBPWanfa(SDHRoomModel.intParams,true);

        str = str.replace(/\s/g,"\n");

        var label = UICtor.cLabel(str,36);
        label.setAnchorPoint(0,0.5);
        label.setColor(cc.color(239,145,87));
        label.setPosition(20,cc.winSize.height/2);
        this.addChild(label,1);
    },

    setTypeInfo:function(){
        var jiaofen = this.msgData.ext[22];

        this.label_jiaofen.setString("叫分:" + jiaofen);
        this.label_defen.setString("得分:" + this.msgData.ext[23]);

        var typeArr = [];

        var config = {"-3":"大倒","-2":"小倒","-1":"垮庄","1":"保庄","2":"小光","3":"大光"};
        var type = SDHRoomModel.getScoreType(this.msgData.ext[22],this.msgData.ext[23]);

        if(this.msgData.ext[26] >= 1){
            typeArr.push("投降x" + this.msgData.ext[26]);
        }else if(config[type]){
            typeArr.push(config[type]);
        }

        if(this.msgData.ext[24] == 1)typeArr.push("抠底");

        this.label_type.setString(typeArr.join("\n"));
    },

});
