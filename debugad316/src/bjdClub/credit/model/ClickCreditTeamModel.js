/**
 * Created by Administrator on 2016/6/24.
 */
var ClickCreditTeamModel = {
    clickTeamId:null,            //上次点击某小组的ID

    clearTeamData:function(){
        this.clickTeamId = null;
    },

    init:function(data){
        this.clearTeamData();
        this.clickTeamId = data.teamId;
    },

    /**
     * 获取当前小组ID
     */
    setCurTeamId:function(id){
        this.clickTeamId = id;
    },

    /**
     * 获取当前小组ID
     */
    getCurTeamId:function(){
        return this.clickTeamId;
    },


    /**
     * 是否有小组ID
     */
    getIsHasTeamId:function(){
        return this.clickTeamId == null;
    }

}