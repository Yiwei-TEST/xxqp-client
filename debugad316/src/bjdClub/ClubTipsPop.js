/**
 * Created by zyq on 2019/11/9.
 */

var ClubTipsPop = BasePopup.extend({
    ctor: function (type) {
        this.type = type;
        this.total_tips = 2;
        this._super("res/clubTipsPop.json");
    },

    selfRender:function(){
        for(var i = 1;i<=this.total_tips;i++){
            var panel = this.getWidget("Panel_tips_"+i);
            if(this.type == i){
                panel.visible = true;
            }else{
                panel.visible = false;
            }
        }
    }
})
