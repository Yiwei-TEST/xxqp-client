/**
 * Created by zhoufan on 2017/5/4.
 */
var ShareDailyModel = {

    hasOpenByPushMsg:false, //记录是否由后台推送消息打开过
    isShareToday:0,
    isFromShareDaily:false,
    isNewShareDaily:false,

    reset:function(){
        this.isShareToday = 0;
        this.isFromShareDaily = false;
    },

    getFeedContent: function() {
        var feeds = [
            "江南棋牌平台~扑特色玩法，简单好玩，猛戳下载！",
            "江南棋牌平台~自主创房自定规则，休闲娱乐还能这样玩！",
            "湖南人最喜欢的竞技平台，点进来就知道了~",
        ];
        var max = SyConfig.hasOwnProperty("HAS_PNG_SHARE") ? feeds.length : feeds.length - 1;
        var rand = MathUtil.mt_rand(1,max);
        //快乐打筒子-玩家数量遥遥领先，成为代理，惊喜等着你！

        return feeds[rand-1];
    },

    getShareContent: function() {
        var max = 16;
        var feeds = [
            "江南棋牌平台~扑特色玩法，简单好玩，猛戳下载！",
            "江南棋牌平台~自主创房自定规则，休闲娱乐还能这样玩！",
            "湖南人最喜欢的竞技平台，点进来就知道了~",
        ];
        var rand = MathUtil.mt_rand(1,feeds.length);
        //快乐打筒子-玩家数量遥遥领先，成为代理，惊喜等着你！
        return feeds[rand-1];
    }

}
