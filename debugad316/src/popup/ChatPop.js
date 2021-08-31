/**
 * Created by Administrator on 2016/6/27.
 */
var ChatData = {
    lastChatTime:0,
    selected:1,
    pdk_fix_msg:["大家好，很高兴见到各位","你的牌打的也太好了","哈哈，手气真好","快点吧，我等到花儿都谢了",
        "不要走，决战到天亮","今天真高兴","怎么又断线了，网络怎么这么差啊","君子报仇，十盘不算晚","打错了，呜呜",
        "各位，真是不好意思，我得离开一会儿","再见了，我会想念大家的"],
    pdk_fix_msg_name:["fix_msg_djh","fix_msg_ddh","fix_msg_sqh","fix_msg_kdb",
        "fix_msg_byz","fix_msg_gx","fix_msg_dx","fix_msg_jzbc","fix_msg_dcl",
        "fix_msg_lk","fix_msg_zj"],

    mj_fix_msg:["大家好，很高兴见到各位","你的牌打的也太好了","哈哈，手气真好","快点吧，我等到花儿都谢了","不要走，决战到天亮",
        "这个吃的好","你放炮我不胡","真不好意思，又胡了","今天真高兴","怎么又断线了，网络怎么这么差啊","君子报仇，十盘不算晚",
        "打错了，呜呜","各位，真是不好意思，我得离开一会儿","再见了，我会想念大家的"],
    mj_fix_msg_name:["fix_msg_djh","fix_msg_ddh","fix_msg_sqh","fix_msg_kdb","fix_msg_byz",
        "fix_msg_cdh","fix_msg_nfp","fix_msg_yhl","fix_msg_gx","fix_msg_dx","fix_msg_jzbc",
        "fix_msg_dcl","fix_msg_lk","fix_msg_zj"],

    dn_fix_msg:["大家好，很高兴见到各位","哈哈，手气真好","快点吧，我等到花儿都谢了","不要走，决战到天亮",
        "今天真高兴","怎么又断线了，网络怎么这么差啊",
        "各位，真是不好意思，我得离开一会儿","再见了，我会想念大家的"],
    dn_fix_msg_name:["fix_msg_djh","fix_msg_sqh","fix_msg_kdb","fix_msg_byz","fix_msg_gx","fix_msg_dx","fix_msg_lk","fix_msg_zj"],

    phz_fix_msg:["大家好，很高兴见到各位","你的牌打的也太好了","哈哈，手气真好","快点吧，我等到花儿都谢了","不要走，决战到天亮",
        "这个吃的好","你放炮我不胡","真不好意思，又胡了","今天真高兴","怎么又断线了，网络怎么这么差啊","君子报仇，十盘不算晚",
        "打错了，呜呜","各位，真是不好意思，我得离开一会儿","再见了，我会想念大家的"],
    phz_fix_msg_name:["fix_msg_djh","fix_msg_ddh","fix_msg_sqh","fix_msg_kdb","fix_msg_byz",
        "fix_msg_cdh","fix_msg_nfp","fix_msg_yhl","fix_msg_gx","fix_msg_dx","fix_msg_jzbc",
        "fix_msg_dcl","fix_msg_lk","fix_msg_zj"],

    dtz_fix_msg:["快点,你在塞毛哦","你能走上游不" ,"让我来打", "你要么子","你能管么","你牌好打么","牌不好打",
        "你管好自己","我先走对你有用没有","我先走了","要单张",
        "要多连对","要飞机","要连对","要三个头","不好意思,又要第一了" , "接个电话等我一下"],
    dtz_fix_msg_name:["_voice0","_voice5","_voice8","_voice2","_voice4","_voice6","_voice7",
        "_voice3", "_voice9","_voice10","_voice11",
        "_voice12", "_voice13", "_voice14","_voice15","_voice16" , "_voice1"],
    ddt_fix_msg:["大家好，很高兴见到各位","你的牌打的也太好了","哈哈，手气真好","快点吧，我等到花儿都谢了",
        "不要走，决战到天亮","今天真高兴","怎么又断线了，网络怎么这么差啊","君子报仇，十盘不算晚","打错了，呜呜",
        "各位，真是不好意思，我得离开一会儿","再见了，我会想念大家的"],
    ddt_fix_msg_name:["fix_msg_djh","fix_msg_ddh","fix_msg_sqh","fix_msg_kdb",
        "fix_msg_byz","fix_msg_gx","fix_msg_dx","fix_msg_jzbc","fix_msg_dcl",
        "fix_msg_lk","fix_msg_zj"],

    tjmj_fix_msg:["把扎你恰你又不得亏","打扎来碰","恶扎鬼何只个啊，要噶时打呢！","搞扎来恰", "果号炮都要啊！",
        "哈哈，胡噶达！","坏笑","快点出牌咯！","快点快点，要晕噶打",
        "莫放炮赖","莫跟我比黑赖","你一点蠢吧，果号牌都打",
        "恰口擂茶，打杂哈哈","恰擂茶","手气不错啊！","数钱","睡着了吧，还不出牌"],
    tjmj_fix_msg_name:["normlaguage_1","normlaguage_2","normlaguage_3","normlaguage_4",
        "normlaguage_5","normlaguage_6","normlaguage_7","normlaguage_8","normlaguage_9",
        "normlaguage_10","normlaguage_11","normlaguage_12","normlaguage_13","normlaguage_14",
        "normlaguage_15","normlaguage_16","normlaguage_17"],

    gdcsmj_fix_msg:["猛者，着去拜下老爷咩？","啊你踏卡车是浪险死是咩","恁有听够钱声咧咧叫有无","副牌摸起来到甜甜", "我打局派派个客宁看呐",
        "牌照凹，矮卖个拿错恁个","嗒做个客宁酸米参宁酸哪","停下停下，马上回来"],
    gdcsmj_fix_msg_name:["xianhua1","xianhua2","xianhua3","xianhua4",
        "xianhua5","xianhua6","xianhua7","xianhua8"],

    hbgzp_fix_msg:["好积极呀，都坐上了！","快点挣罗，莫愣罗！","您儿的牌打得太精哒！","不好意思，掉了线掉了线",
        "今儿搞个通宵呀!不搞通宵不准走啊!","手气太好哒","这时才胡了一牌", "瞌睡来哒，瞌睡来哒！"],
    hbgzp_fix_msg_name:["chat1","chat2","chat3","chat4",
        "chat5","chat6","chat7","chat8"],

    qf_fix_msg:["不晓得果慢，晕的死。","超速哒死呢！","果杂满哥，牌打得蛮好啊。","果杂妹几，牌打得蛮好啊。","果手牌就打得素呢。",
        "快点几咯，莫跟个闷妈子一样地要得吧。","亲们，连不好意思，我有点小事情去。","手气真滴索得叫呢，硬冒硬一盘拉","速度点要得吧，像个晕鸡子一样"
        ],
    qf_fix_msg_name:["normlaguage_1","normlaguage_2","normlaguage_3","normlaguage_4",
        "normlaguage_5","normlaguage_6","normlaguage_7","normlaguage_8","normlaguage_9",
        "normlaguage_10","normlaguage_11","normlaguage_12","normlaguage_13","normlaguage_14"],
    yjmj_fix_msg:["何噶国慢啦,从湘北走到巴山路哒牌还冒出来!","打大不打小，打小有点宝！","莫吵莫吵，等哈赢钱哒请你掐麻辣烫！",
        "牌一框，三六万", "崽呀崽，注意点，莫让我一把做翻哒！", "卵咯，你怕我吓大滴哦！","国又哦得了哦，桩子裤都快输噶哒勒！",
        "哎呀，国咋妹几牌打得蛮好勒！","哦改国慢咯，等得想睡觉了！", "怕卵呢，反正输大哒！ ","把点面子把我，让我胡一把！","你快点咯，莫晕鸡子一样咯！"],
    yjmj_fix_msg_name:["fixMsg_0","fixMsg_1","fixMsg_2","fixMsg_3","fixMsg_4","fixMsg_5","fixMsg_6","fixMsg_7","fixMsg_8", "fixMsg_9","fixMsg_10","fixMsg_11"],

    yjghz_fix_msg:["你快点咯，莫晕鸡子一样咯！","吵死哦，吵死哦，未必想都不能想！","咯有何得了咯，桩子裤都快输噶呢！",
        "怕卵呢，反正输大哒！", "把点面子把我，让我胡一把！", "崽呀崽，注意点，莫让我一把做翻哒！","卵咯，你怕我吓大滴哦！",
        "莫吵莫吵，等哈赢钱哒请你掐麻辣烫！","哎呀，国咋妹几牌打得蛮好勒！", "哦改国慢咯，等得想睡觉了！"],
    yjghz_fix_msg_name:["fixMsg_0","fixMsg_1","fixMsg_2","fixMsg_3","fixMsg_4","fixMsg_5","fixMsg_6","fixMsg_7","fixMsg_8", "fixMsg_9"],

    tcpfmj_fix_msg:["桐城人打牌就是这么牛！","这牌烂的我都不想耍！","你碰、上碰下摸 ！",
        "你这牌打的太好了 ！", "能不能搞快点！要瞌睡了！", "不要走，打到明天早上 ！ ","别催哦！让我好好想会 ！","这牌肯定是我的，不信走着瞧！"],
    tcpfmj_fix_msg_name:["fix_msg_1","fix_msg_2","fix_msg_3","fix_msg_4","fix_msg_5","fix_msg_6","fix_msg_7","fix_msg_8"],

    tcgd_fix_msg:["桐城人出牌就是这么牛","给我机会你们就双夹","能不能搞快点！我还想多打几牌","不要走，决战到天亮",
        "不要催！这牌要好好想想","你这首牌打出了摜蛋的水平","你把摜蛋打出了跑得快的感觉"],

    dzmj_fix_msg:["本来不想要你的炮，实在是忍不到了","吃一枪色一张，漏五八的欧","打快点吧，你再摸斗斗蛆啊","给我吃一枪吧，你硬和铁鸡公一样的",
        "跟那么紧，你给是怕色给","接个电话吼，等哈子我","看你乐死哈，等哈你就晓得错滴哒","老板把门关好些这盘要封顶了","麻将有首歌，上碰下自摸",
        "你够会扣牌滴，给是读给牌书嗷","我讲给滴吧，有碰不碰拿钱来送"],

    };


var ChatPop = BasePopup.extend({

    ctor: function (json) {
        var json = json || "res/chat.json";
        this._super(json);
    },

    selfRender: function () {
        //this.PLACEHOLDER="#";
        UITools.addClickEvent(this.getWidget("main1"),this,this.onMainClick);
        this.main2 = this.getWidget("main2");
        this.listView1 = this.getWidget("ListView_26");
        this.listView1.removeAllItems();
        this.listView2 = this.getWidget("ListView_27");
        this.listView2.removeAllItems();
        this.Button_19 = this.getWidget("Button_19");
        this.Button_19.temp = 1;
        this.Button_20 = this.getWidget("Button_20");
        this.Button_20.temp = 2;
        //this.Button_28 = this.getWidget("Button_28");
        this.Panel_10 = this.getWidget("Panel_10");
        this.Panel_10.visible = false;
        this.mainPopup = this.getWidget("mainPopup");
        UITools.addClickEvent(this.Button_19,this,this.onSwitch);
        UITools.addClickEvent(this.Button_20,this,this.onSwitch);
        //UITools.addClickEvent(this.Button_28,this,this.onSend);
        if(ChatData.selected==1)
            this.onSwitch(this.Button_19);
        else
            this.onSwitch(this.Button_20);

        if (this.main2){
            this.main2.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH) /2 + 1568;
        }else if(this.mainPopup){
            this.mainPopup.x = (cc.winSize.width - SyConfig.DESIGN_WIDTH) /2 + 1559;
        }
    },

    sendMsg:function(a,b,c){
        var now = new Date().getTime();
        if((now-ChatData.lastChatTime)>3000){
            ChatData.lastChatTime = now;
            sySocket.sendComReqMsg(a,b,c);
            return true
        }else{
            FloatLabelUtil.comText("发送间隔不能小于3秒");
            return false;
        }
    },

    onSend:function(){
        var txt=this.currentlyText.getString();
        if(txt.length>0){
            if(txt.indexOf("#")>=0){
                return FloatLabelUtil.comText("包含特殊字符");
            }
            if(txt.length<=30){
                var bool = this.sendMsg(9,[0],[txt]);
                if(bool){
                    this.currentlyText.setString("");
                    PopupManager.remove(this);
                }
            }else{

            }
        }
    },

    createFastChat:function(label,temp){
        var ui = new ccui.Widget();
        ui.temp = temp;
        ui.setTouchEnabled(true);
        ui.setContentSize(570,96);
        var sprite = new cc.Sprite("res/ui/common/img_chat_1.png");
        sprite.x = ui.width/2;
        sprite.y = ui.height/2;
        ui.addChild(sprite);

        var fontSize = 39;
        var isDTZ = (LayerManager.isInDTZ());
        if(isDTZ){
            fontSize = 39;
        }else{
            fontSize = 33;
        }

        var label = UICtor.cLabel(label,fontSize,cc.size(570,100),cc.color("#d0f8fd"),1,1);
        label.x = sprite.width/2;
        label.y = sprite.height/2;
        sprite.addChild(label);
        UITools.addClickEvent(ui,this,this.onFastChat);
        return ui;
    },

    createEmoji:function(faceArray){
        var ui = new ccui.Widget();
        ui.setContentSize(570,750);
        for(var i=1;i<=4;i++){
            var ri = i-1;
            var max = i*2;
            var min = max-2;
            var rIndex = 0;
            for(var j=min;j<max;j++){
                var sprite = new ccui.Button();
                sprite.loadTextureNormal("res/ui/emoji/Expression"+(j+1)+".png");
                sprite.setZoomScale(0);
                sprite.temp = j+1;
                ui.addChild(sprite);
                sprite.x = 200+rIndex*207;
                if(rIndex>0)
                    sprite.x-=rIndex*2;
                sprite.y =620-ri*199;
                if(ri>0)
                    sprite.y+=ri*2;
                UITools.addClickEvent(sprite,this,this.onEmoji);
                rIndex++;
            }
        }
        return ui;

    },

    onFastChat:function(obj){
        var bool = this.sendMsg(9,[obj.temp],[]);
        if(bool){
            if(this.json=="res/dtzChat.json"){
                DTZRoomSound.fixMsg(PlayerModel.userId,obj.temp);
            }else if(this.json=="res/qfChat.json"){
                QFRoomSound.fixMsg(PlayerModel.userId,obj.temp);
            }
            PopupManager.remove(this);
        }
    },

    editBoxEditingDidBegin: function (editBox) {
        if(SyConfig.isIos())
            this.Panel_10.visible = true;
        cc.log("editBox DidBegin !");
    },

    editBoxEditingDidEnd: function (editBox) {
        if(SyConfig.isIos()){
            var self = this;
            setTimeout(function(){self.Panel_10.visible = false;},30);
        }
        cc.log("editBox DidEnd !");
    },

    onMainClick:function(){
        cc.log("onMainClick.......... !");
        PopupManager.remove(this);
    },

    onEmoji:function(obj){
        var bool = this.sendMsg(9,[-1],[obj.temp+""]);
        if(bool)
            PopupManager.remove(this);
    },

    onSwitch:function(obj){
        var temp = obj.temp;
        ChatData.selected = temp;
        this.listView1.visible = this.listView2.visible = false;

        var isPHZ = (LayerManager.isInPHZ());
        var isPDK = (LayerManager.isInPDK());
        var isDTZ = (LayerManager.isInDTZ());
        var isMJ = (LayerManager.isInMJ());
        var isHBGZP = (LayerManager.isInHBGZP());

        if(temp == 1){
            if(this.listView1.getItems().length==0){
                var array = [];
                //cc.log("DTZRoomModel.wanfa..." , DTZRoomModel.wanfa);
                if(this.json=="res/chat.json"){
                    if(isDTZ){
                        array = ChatData.dtz_fix_msg;
                    }else if(isPDK){
                        array = ChatData.pdk_fix_msg;
                    } else if(isPHZ){
                        array = ChatData.phz_fix_msg;
                    }else if(isMJ){
                        array = ChatData.mj_fix_msg;
                        if(BaseRoomModel.curRoomData.wanfa ==  GameTypeEunmMJ.TCDPMJ || BaseRoomModel.curRoomData.wanfa ==  GameTypeEunmMJ.TCPFMJ){
                            array = ChatData.tcpfmj_fix_msg
                        }
                    }else if(isHBGZP){
                        array = ChatData.hbgzp_fix_msg;
                    }else{
                        array = ChatData.pdk_fix_msg;
                    }
                }else if(this.json=="res/qfChat.json"){
                    array = ChatData.qf_fix_msg;
                }else{
                    array = ChatData.mj_fix_msg;
                }

                if(BaseRoomModel.curRoomData){
                    if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmMJ.YJMJ){
                        array = ChatData.yjmj_fix_msg;
                    }else if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmZP.YJGHZ){
                        array = ChatData.yjghz_fix_msg;
                    }else if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmPK.TCGD){
                        array = ChatData.tcgd_fix_msg;
                    }else if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmMJ.TJMJ){
                        array = ChatData.tjmj_fix_msg;
                    }else if(BaseRoomModel.curRoomData.wanfa == GameTypeEunmMJ.DZMJ){
                        array = ChatData.dzmj_fix_msg;
                    }
                }

                for(var i=0;i < array.length;i++){
                    this.listView1.pushBackCustomItem(this.createFastChat(array[i],(i+1)));
                }
            }
            this.listView1.visible = true;
            this.Button_19.setBright(true);
            this.Button_20.setBright(false);
        }else{
            if(this.listView2.getItems().length==0)
                this.listView2.pushBackCustomItem(this.createEmoji());
            this.listView2.visible = true;
            this.Button_19.setBright(false);
            this.Button_20.setBright(true);
        }
    }
});