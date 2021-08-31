/**
 * Created by Administrator on 2016/6/27.
 */
var AgreementCell = ccui.Widget.extend({

    ctor:function(label){
        this._super();
        var text = UICtor.cLabel(label, 26, cc.size(900,0), cc.color("#8E6748"), 0, 0);
        text.anchorX=text.anchorY=0;
        this.addChild(text);
        this.setContentSize(text.width,text.height);
        this.x = 10;
    }

})

var AgreementPop = BasePopup.extend({

    ctor: function () {
        this._super("res/agreement.json");
    },

    selfRender: function () {
        var list = this.getWidget("ListView_6");
        list.pushBackCustomItem(new AgreementCell("1 特别提示"));
        list.pushBackCustomItem(new AgreementCell("    湖南联盛网络科技股份有限公司(以下统称为“联盛”)同意按照本协议的规定及其不时发布的操作规则提供基于互联网的相关服务(以下称“网络服务”)，"));
        list.pushBackCustomItem(new AgreementCell("为获得网络服务，服务使用人(以下称“用户”)同意本协议的全部条款并按照页面上的提示完成全部的注册程序。"));
        list.pushBackCustomItem(new AgreementCell("用户在进行注册程序过程中点击“马上注册”按钮即表示用户完全接受本协议项下的全部条款。"));
        list.pushBackCustomItem(new AgreementCell("这些条款可由联盛随时更新，本服务协议一旦发生变动，联盛将会在相关的页面上提示修改内容。"));
        list.pushBackCustomItem(new AgreementCell("修改后的服务协议一旦在页面上公布即有效代替原来的服务协议。"));
        list.pushBackCustomItem(new AgreementCell("用户可随时造访http://account.limsam.cn/agreement.html查阅最新服务协议。"));
        list.pushBackCustomItem(new AgreementCell("用户在使用联盛提供的各项服务之前，应仔细阅读本服务协议，如用户不同意本服务协议及/或随时对其修改后的服务协议，请立即停止使用联盛提供的服务。"));
        list.pushBackCustomItem(new AgreementCell("2 服务内容"));
        list.pushBackCustomItem(new AgreementCell("    2.1 联盛服务的具体内容由联盛根据实际情况提供，服务内容包括但不限于网络游戏、商城、博客(BLOG)、论坛(BBS)、聊天室、电子邮件、发表新闻评论服务等。"));
        list.pushBackCustomItem(new AgreementCell("联盛保留随时变更、中断或终止部分或全部网络服务的权利，联盛不承担因业务调整给用户造成的损失。"));
        list.pushBackCustomItem(new AgreementCell("    2.2联盛在提供网络服务时，可能会对接受部分网络服务(例如网络游戏及其他电信增值服务)的用户收取一定的费用。在此情况下，联盛会在相关页面上做明确的提示。"));
        list.pushBackCustomItem(new AgreementCell("如用户不同意支付该等费用，则可不接受相关的网络服务。"));
        list.pushBackCustomItem(new AgreementCell("    2.3用户理解：联盛仅提供相关的网络服务，除此之外与相关网络服务有关的设备(如电脑、调制解调器及其他与接入互联网有关的装置)及所需的费用(如为接入互联网而支付的电话费及上网费)均应由用户自行负担。"));
        list.pushBackCustomItem(new AgreementCell("    2.4联盛有可能针对某项服务添加相关特别约定或服务协议，届时用户接受该项服务的前提为同意该项服务所附带的所有法律文件，包括但不限于本网络服务使用协议及专项服务协议。"));
        list.pushBackCustomItem(new AgreementCell("3 使用规则"));
        list.pushBackCustomItem(new AgreementCell("    3.1用户在申请使用联盛网络服务时，必须向联盛提供准确的个人资料，如个人资料有任何变动，必须及时更新。因用户提供个人信息不真实所造成的一切后果由用户自行承担。"));
        list.pushBackCustomItem(new AgreementCell("    3.2用户申请成功后，联盛将给予每个用户一个用户账号及相应的密码，该用户账号和密码由用户负责保管。"));
        list.pushBackCustomItem(new AgreementCell("用户应当对以其用户账号进行的所有活动和事件负法律责任。若因为用户自身原因，而导致账号、密码遭他人非法使用时，联盛不负任何责任。"));
        list.pushBackCustomItem(new AgreementCell("用户自身原因包括但不限于：任意向第三者透露账号和密码及所有注册资料；多人共享同一个账号；安装非法或来路不明的程序等。"));
        list.pushBackCustomItem(new AgreementCell("    3.3用户必须同意接受联盛通过电子邮件或其他方式向用户发送联盛或其合作伙伴的商品促销或其他相关商业信息。"));
        list.pushBackCustomItem(new AgreementCell("    3.4用户输入的姓名和身份证、护照、军人证号码结合其与之对应的证件，作为联盛通行证用户的唯一有效身份证明；在无法有效证明其身份时，联盛有权拒绝提供任何信息或承担任何义务。"));
        list.pushBackCustomItem(new AgreementCell("    3.5用户在使用联盛服务过程中，必须遵循以下原则："));
        list.pushBackCustomItem(new AgreementCell("(A) 遵守中国有关的法律和法规；"));
        list.pushBackCustomItem(new AgreementCell("(B) 不得为任何非法目的而使用网络服务系统；"));
        list.pushBackCustomItem(new AgreementCell("(C) 遵守所有与网络服务有关的网络协议、规定和程序；"));
        list.pushBackCustomItem(new AgreementCell("(D) 不得利用联盛服务系统进行任何可能对互联网的正常运转造成不利影响的行为；"));
        list.pushBackCustomItem(new AgreementCell("(E) 不得利用联盛服务系统传输任何骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料；"));
        list.pushBackCustomItem(new AgreementCell("(F) 不得利用联盛服务系统进行任何不利于联盛的行为；"));
        list.pushBackCustomItem(new AgreementCell("(G) 就联盛及合作商业伙伴的服务、产品、业务等情况的了解应采取相应机构提供的沟通渠道，不得在公众场合发布有关联盛及相关服务的负面宣传。"));
        list.pushBackCustomItem(new AgreementCell("(H) 如发现任何非法使用用户帐号或帐号出现安全漏洞的情况，应立即通告联盛。"));
        list.pushBackCustomItem(new AgreementCell("4.知识产权"));
        list.pushBackCustomItem(new AgreementCell("    4.1联盛提供的网络服务内容可能包括：文字、软件、声音、图片、录象、图表等。所有这些内容受版权法、商标法和其它法律的保护。"));
        list.pushBackCustomItem(new AgreementCell("    4.2用户只有在获得联盛或其他相关权利人的授权之后才能使用上述网络服务内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。"));
        list.pushBackCustomItem(new AgreementCell("未经授权任何人皆不得擅自以任何形式使用上述内容，否则联盛可立即终止向该用户提供产品和服务，并依法追究其法律责任，赔偿联盛一切损失。"));
        list.pushBackCustomItem(new AgreementCell("    4.3用户原创作品上载、传送、输入或以其他方式提供至联盛网站时，视为用户授予联盛对其作品的使用权，该授权无地域、期限、方式限制，该授权为免费授权，联盛可在现行法律范围内就该作品进行免费使用，包括但不限于复制、发行、出租、展览、表演、放映、广播、信息网络传播、摄制、改编、翻译、汇编等，并可将前述权利转、分授权给其他第三方。"));
        list.pushBackCustomItem(new AgreementCell("5.隐私保护"));
        list.pushBackCustomItem(new AgreementCell("    5.1 保护用户隐私是联盛的一项基本政策，联盛保证不对外公开或向第三方提供用户申请资料及用户在使用网络服务时存储在联盛的个人信息，但下列情况除外："));
        list.pushBackCustomItem(new AgreementCell("(a) 事先获得用户的明确授权；"));
        list.pushBackCustomItem(new AgreementCell("(b) 根据有关的法律法规要求；"));
        list.pushBackCustomItem(new AgreementCell("(c) 按照相关政府主管部门的要求；"));
        list.pushBackCustomItem(new AgreementCell("(d) 为维护社会公众的利益；"));
        list.pushBackCustomItem(new AgreementCell("(e) 为维护联盛的合法权益；"));
        list.pushBackCustomItem(new AgreementCell("    5.2在不透露单个用户隐私资料的前提下，联盛有权对整个用户数据库进行技术分析并对已进行分析、整理后的用户数据库进行商业上的利用。 "));
        list.pushBackCustomItem(new AgreementCell("（包括但不限于公布、分析或以其它方式使用用户访问量、访问时段、用户偏好等用户数据信息）。"));
        list.pushBackCustomItem(new AgreementCell("6.免责声明"));
        list.pushBackCustomItem(new AgreementCell("    6.1在适用法律允许的最大范围内，联盛明确表示不提供任何其他类型的保证，不论是明示的或默示的，包括但不限于适销性、适用性、可靠性、准确性、完整性、无病毒以及无错误的任何默示保证和责任。"));
        list.pushBackCustomItem(new AgreementCell("    6.2在适用法律允许的最大范围内，联盛并不担保联盛所提供的产品和服务一定能满足用户的要求，也不担保提供的产品和服务不会被中断，并且对产品和服务的及时性，安全性，出错发生，以及信息是否能准确，及时，顺利的传送均不作任何担保。"));
        list.pushBackCustomItem(new AgreementCell("    6.3在适用法律允许的最大范围内，联盛不就因用户使用联盛的产品和服务引起的，或在任何方面与联盛的产品和服务有关的任何意外的、非直接的、特殊的、或间接的损害或请求(包括但不限于因人身伤害、因隐私泄漏、因未能履行包括诚信或合理谨慎在内的任何责任、因过失和因任何其他金钱上的损失或其他损失而造成的损害赔偿)承担任何责任。"));
        list.pushBackCustomItem(new AgreementCell("    6.4用户在联盛网站和游戏上所表达的观点、建议和其它内容均为用户本人看法，不代表联盛的观点。"));
        list.pushBackCustomItem(new AgreementCell("    6.5联盛保留采取包括但不限于合并服务器等形式以达到服务器资源优化利用的权利，并对由此而可能导致的用户利益损失不承担责任。"));
        list.pushBackCustomItem(new AgreementCell("7. 服务变更、中断或终止"));
        list.pushBackCustomItem(new AgreementCell("    7.1 为了网站和游戏的正常运行，联盛需要定期或不定期地对网站和游戏进行停机维护，因此类情况而造成的正常服务中断、停止，用户应该予以理解，联盛则有义务尽力避免服务中断、停止或将中断、停止时间限制在最短时间内。"));
        list.pushBackCustomItem(new AgreementCell("    7.2如发生下列任何一种情形，联盛有权随时中断或终止向用户提供本协议项下的网络服务而无需通知用户，对因此而产生的不便或损害，联盛对用户或第三人均不承担任何责任："));
        list.pushBackCustomItem(new AgreementCell("(a) 定期检查或施工，更新软硬件等，联盛有权暂停服务，但联盛会尽快完成维护、更新工作；"));
        list.pushBackCustomItem(new AgreementCell("(b) 服务器遭受损坏，无法正常运作；"));
        list.pushBackCustomItem(new AgreementCell("(c) 突发性的软硬件设备与电子通信设备故障；"));
        list.pushBackCustomItem(new AgreementCell("(d) 网络提供商线路或其它故障；"));
        list.pushBackCustomItem(new AgreementCell("(e) 在紧急情况之下为维护国家安全或其它用户及第三者之人身安全；"));
        list.pushBackCustomItem(new AgreementCell("(f) 不可抗力及其他第三方原因；"));
        list.pushBackCustomItem(new AgreementCell("    7.3 除前款所述情形外，用户同意联盛享有通过在提前1个月网站公告通知的方式中断或终止部分或全部网络服务的权利，用户已明确知晓上述权利的授予且知晓因上述权利的行使可能给自身及其他第三方造成的直接或间接利益减损，用户在此明确表示不追究联盛因行使上述单方中断或终止服务权利而可能导致的一切责任。"));
        list.pushBackCustomItem(new AgreementCell("    7.4 如果您在注册联盛通行证后第一个月时间内或连续6个月时间内，没有使用过此联盛通行证(包括使用此联盛通行证登录游戏，登录网站，充值)，则该联盛通行证不会被系统保留。"));
        list.pushBackCustomItem(new AgreementCell("8.违约责任"));
        list.pushBackCustomItem(new AgreementCell("    8.1 如果联盛发现用户有下列任一行为的，有权根据相应网络服务的公约或守则的规定，采取相应措施：包括但不限于对该用户账号的冻结、终止、删除；用户在此承诺联盛有权作出上述行为，并承诺不就上述行为要求联盛做任何补偿或退费："));
        list.pushBackCustomItem(new AgreementCell("(a) 用户提供虚假注册信息；"));
        list.pushBackCustomItem(new AgreementCell("(b) 用户违反本协议中规定的使用规则；"));
        list.pushBackCustomItem(new AgreementCell("(c) 通过非法手段、不正当手段或其他不公平的手段使用联盛的产品和服务或参与联盛活动；"));
        list.pushBackCustomItem(new AgreementCell("(d) 有损害联盛正当利益的行为；"));
        list.pushBackCustomItem(new AgreementCell("(e) 有严重损害其他用户的行为；"));
        list.pushBackCustomItem(new AgreementCell("(f) 有违反中华人民共和国的法律、法规的行为或言论；"));
        list.pushBackCustomItem(new AgreementCell("(g) 有违背社会风俗、社会道德和互联网一般道德和礼仪的行为；"));
        list.pushBackCustomItem(new AgreementCell("(h) 其他妨碍联盛提供产品和服务或联盛认为的严重不当行为；"));
        list.pushBackCustomItem(new AgreementCell("    同一用户若有任一账号存在上述任一行为的，联盛有权对该用户下的所有账号予以制裁，包括但不限于冻结账号、删除账号、终止服务等。"));
        list.pushBackCustomItem(new AgreementCell("如上述行为给联盛造成损失的，有权要求该用户赔偿所造成的一切损失。联盛因上述原因删除用户注册的账号后即不再对用户承担任何义务和责任。"));
        list.pushBackCustomItem(new AgreementCell("    8.2用户同意保障和维护联盛及其他用户的利益，如因用户违反有关法律、法规或本协议项下的任何条款而给联盛或任何其他第三人造成损失，用户同意承担由此造成的损害赔偿责任。"));
        list.pushBackCustomItem(new AgreementCell("9.修改协议"));
        list.pushBackCustomItem(new AgreementCell("    9.1 联盛将可能不时的修改本协议的有关条款，一旦条款内容发生变动，联盛将会在相关的页面提示修改内容。"));
        list.pushBackCustomItem(new AgreementCell("    9.2 如果用户不同意联盛修改的内容，用户可以主动取消获得的网络服务。如果用户在修改内容公告后15天内未主动取消服务，则视为接受条款的变更；修改内容公告后用户如果仍继续使用联盛提供的产品和服务亦构成对条款变更的接受。"));
        list.pushBackCustomItem(new AgreementCell("10.法律管辖"));
        list.pushBackCustomItem(new AgreementCell("    10.1 本协议的订立、执行和解释及争议的解决均应适用中国法律。"));
        list.pushBackCustomItem(new AgreementCell("    10.2 如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，用户和联盛一致同意交由网站运营商所在地有管辖权的法院管辖。"));
        list.pushBackCustomItem(new AgreementCell("11.通知和送达"));
        list.pushBackCustomItem(new AgreementCell("   11.1本协议项下所有的通知均可通过联盛公司主页或游戏主页公告、电子邮件或常规的信件传送等方式进行；该等通知于发送之日视为已送达收件人。"));
        list.pushBackCustomItem(new AgreementCell("12.其他规定"));
        list.pushBackCustomItem(new AgreementCell("    12.1 本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。"));
        list.pushBackCustomItem(new AgreementCell("    12.2 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。"));
        list.pushBackCustomItem(new AgreementCell("    12.3 本协议中的标题仅为方便而设，在解释本协议时应被忽略。"));
        list.pushBackCustomItem(new AgreementCell("* 本条款的最终解释权归联盛所有"));
    }
});