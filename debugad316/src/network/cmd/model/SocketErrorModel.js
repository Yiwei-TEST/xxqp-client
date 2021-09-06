var SocketErrorModel = {
    _socketList:null,
    _loginIndex:0,
    _gameIndex:0,

    init:function(){
        if (SyConfig.DEBUG) {
            return
        }
        this._socketList = {
            login:{
                ips:"http://login.sheyt.cn/,",
                ports:""
            },
            game:{
                ips:"login.xupizea.cn,",
                ports:"9001,9002,9003,9004"
            }
        }

        // this._gameIndex  = UITools.getLocalItem("Socket_gameIndex")  || 0;
        // this._loginIndex = UITools.getLocalItem("Socket_loginIndex") || 0;
        this._gameIndex = 0;
        this._loginIndex = 0;

        var _login = this._socketList.login;
        var _loginHosts = GameConfig.parseHost(_login.ips);
        SyConfig.REQ_URL   =  _loginHosts[this._loginIndex] + "pdklogin/" + "{0}!{1}.action";
        SyConfig.LOGIN_URL =  _loginHosts[this._loginIndex] + "pdklogin/" + "{0}!{1}.guajilogin";

        var _game = this._socketList.game;
        var _gameHosts = GameConfig.parseHost(_game.ips);

        SyConfig.WS_HOST = _gameHosts[this._gameIndex];
        SyConfig.WS_PORT = _game.ports;

        // cc.log("LOGIN_URL===",this._loginIndex,SyConfig.REQ_URL,SyConfig.LOGIN_URL)
        // cc.log("WS_HOST===",this._gameIndex,SyConfig.WS_HOST,SyConfig.WS_PORT)
    },

    setGameIndex:function(_gameIndex){
        this._gameIndex = _gameIndex
        UITools.setLocalItem("Socket_gameIndex",_gameIndex);
    },

    setLoginIndex:function(_LoginIndex){
        this._loginIndex = _LoginIndex;
        UITools.setLocalItem("Socket_loginIndex",this._loginIndex);
    },

    updateLoginIndex:function(){
        if (this._socketList){
            var _login = this._socketList.login;
            var _loginHosts = GameConfig.parseHost(_login.ips);
            // if (this._loginIndex + 1 >= _loginHosts.length){
                this._loginIndex = 0;
            // }else{
            //     this._loginIndex = this._loginIndex + 1;
            // }
            SyConfig.REQ_URL   =  _loginHosts[this._loginIndex] + "pdklogin/" + "{0}!{1}.action";
            SyConfig.LOGIN_URL =  _loginHosts[this._loginIndex] + "pdklogin/" + "{0}!{1}.guajilogin";
            UITools.setLocalItem("Socket_loginIndex",this._loginIndex);
            cc.log("updateLoginIndex===",this._loginIndex,SyConfig.REQ_URL,SyConfig.LOGIN_URL)
        }
    },

    updateGameIndex:function(){
        if (this._socketList){
            var _game = this._socketList.game;
            var _gameHosts = GameConfig.parseHost(_game.ips);
            var _gameports = GameConfig.parseHost(_game.ports);
            var _gameport = _gameports[MathUtil.mt_rand(0, _gameports.length-1)];
            // if (this._gameIndex + 1 >= _gameHosts.length){ 
                this._gameIndex = 0;
            // }else{
            //     this._gameIndex = this._gameIndex + 1;
            // }
            SyConfig.WS_HOST = _gameHosts[this._gameIndex];
            SyConfig.WS_PORT = _gameport;
            sySocket.url = "ws://" + _gameHosts[this._gameIndex] + ":"  + _gameport;
            UITools.setLocalItem("Socket_gameIndex",this._gameIndex);
            cc.log("updateGameIndex===",this._gameIndex,sySocket.url)
        }
    },


}