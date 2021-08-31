/**
 * Created by zhoufan on 2016/8/16.8
 */
var MJGangPop = BasePopup.extend({

    ctor:function(){
        this._super("res/mjGang.json");
    },

    selfRender:function(){
        //CsMjGangModel.name = "Steven";
        //CsMjGangModel.gangId = 33;
        //CsMjGangModel.gangActs = [
        //    {"majiangId":88,"selfAct":[]},
        //    {"majiangId":88,"selfAct":[]}
        //];

        var acts = CsMjGangModel.gangActs;

        this.layerBg = this.getWidget("layerBg");
        this.panel_btn_1 = this.getWidget("panel_btn_1");
        this.panel_btn_2 = this.getWidget("panel_btn_2");
        this.panel_btn_3 = this.getWidget("panel_btn_3");
        this.panel_btn_4 = this.getWidget("panel_btn_4");

        var bgHeight = 750;
        if(acts.length > 2){
            bgHeight += 150;
            this.layerBg.setContentSize(this.layerBg.width,bgHeight);
            this.layerBg.y += 75;
        }

        var offsetY = 210;
        if(acts.length == 3)offsetY = 195;
        else if(acts.length == 4)offsetY = 150;
        var startY = (acts.length - 1)/2*offsetY + this.layerBg.height/2 - 60;
        for(var i = 0;i<4;++i){
            this["panel_btn_" + (i+1)].setVisible(i<acts.length);
            this["panel_btn_" + (i+1)].y = startY - offsetY*i;
        }

        var btn_guo = this.getWidget("btn_guo");
        var btn_hu = this.getWidget("btn_hu");

        btn_guo.y = btn_hu.y = 120;

        UITools.addClickEvent(btn_guo,this,this.onClickGuo);
        UITools.addClickEvent(btn_hu,this,this.onClickHu);


        var cofigArr = [{name:"btn_chi",t:4,v:6},{name:"btn_peng",t:1,v:2},{name:"btn_gang",t:2,v:3},{name:"btn_bu",t:5,v:7}];
        for(var i = 0;i<cofigArr.length;++i){
            for(var j = 0;j<acts.length;++j){
                var btn = ccui.helper.seekWidgetByName(this["panel_btn_" + (j+1)],cofigArr[i].name);
                btn.temp = cofigArr[i];
                btn.flag = j;
                UITools.addClickEvent(btn,this,this.onBtnClick);

                var is_valid = acts[j] && (acts[j].selfAct[cofigArr[i].t]);
                //暗杠的情况
                if(cofigArr[i].name == "btn_gang"){
                    if(acts[j] && acts[j].selfAct[3]){
                        is_valid = true;
                        btn.temp = {name:"btn_gang",t:3,v:4}
                    }
                }
                btn.setBright(is_valid);
                btn.setTouchEnabled(is_valid);
            }
        }

        var hasHu = false;
        var gangHu = false;
        for(var i=0;i<acts.length;i++){
            var mj = new CSMahjong(MJAI.getDisplayVo(1,2),MJAI.getMJDef(acts[i].majiangId));
            mj.setAnchorPoint(0.5,0.5);
            mj.setPosition(50,100);
            mj._bg.setColor(cc.color.YELLOW);
            this["panel_btn_"+(i+1)].addChild(mj);
            if(acts[i].selfAct[0] || acts[i].selfAct[17]){
                hasHu = true;
            }
            if(acts[i].selfAct[17]){
                gangHu = true;
            }
        }

        if(!hasHu){
            btn_hu.setVisible(false);
            btn_guo.setPositionX(this.layerBg.width/2);
        }
        if(gangHu){
            btn_guo.setVisible(false);
            btn_hu.setPositionX(this.layerBg.width/2);
        }

        var label_tip = this.getWidget("label_tip");
        label_tip.y = this.layerBg.height - 45;
        label_tip.setString("玩家【" + CsMjGangModel.name + "】开杠补牌");
        this.addCustomEvent(SyEvent.LET_OUT_CARD,this,this.onLetOutCard);


    },

    onClickGuo:function(){
        MJRoomModel.sendPlayCardMsg(5,[]);
    },

    onClickHu:function(){
        MJRoomModel.sendPlayCardMsg(1,[]);
    },

    onLetOutCard:function(event){
        var message = event.getUserData();
        if(message.action != MJAction.CHU_PAI){
            PopupManager.remove(this);
        }
    },

    onBtnClick:function(obj){
        var temp = obj.temp;
        var v = parseInt(temp.v);
        var id = parseInt(CsMjGangModel.gangActs[obj.flag].majiangId);
        var lastVo = MJAI.getMJDef(id);
        if(v==6){//吃
            var chi = MJAI.getChi(MJRoomModel.mineLayout.getPlace1Data(),lastVo);
            if(chi.length>1){
                if(this.layerBg.getChildByTag(123))
                    return;
                var bg = new cc.Scale9Sprite("res/res_mj/mjRoom/img_50.png");
                bg.setContentSize(chi.length*70*3+(23*(chi.length+1)),120);
                bg.x = this.layerBg.width/2 + 75;
                bg.y = this.layerBg.height/2 + 75;
                var count = 0;
                for(var i=0;i<chi.length;i++){
                    var chiArr = chi[i];
                    var initX = (i+1)*23;
                    for(var j=0;j<chiArr.length;j++){
                        var chiVo = chiArr[j];
                        chiVo.se = 6;
                        chiVo.ids = [chiArr[0].c,chiArr[2].c,id];
                        var mahjong = new CSMahjong(MJAI.getDisplayVo(3,2),chiVo);
                        mahjong.x = initX+70*count;mahjong.y = 3;
                        bg.addChild(mahjong);
                        if(j==1){
                            mahjong._bg.setColor(cc.color.YELLOW);
                        }
                        count++;
                    }
                }
                this.layerBg.addChild(bg,1,123);
            }else{
                var ids = [];
                var array = chi[0];
                for(var i=0;i<array.length;i++){
                    var vo = array[i];
                    if(vo.n!=lastVo.n)
                        ids.push(vo.c);
                }
                ids.push(id);
                MJRoomModel.sendPlayCardMsg(6,ids);
            }
        }else if(v==2||v==3||v==7||v==4){
            var allMJs = MJRoomModel.mineLayout.getPlace1Data();
            var ids = [];
            for(var i=0;i<allMJs.length;i++){
                var vo = allMJs[i];
                if(vo.t==lastVo.t&&vo.n==lastVo.n)
                    ids.push(vo.c);
                if(ids.length>=v)
                    break;
            }
            ids.push(id);
            MJRoomModel.sendPlayCardMsg(v,ids);
        }
    }
});
