
var WZQChessLayer = {
    _chessW:67,
    setRoot:function(root){
        this.root = root
        this.root.addTouchEventListener(this.onTouchHandler,this.root);
    },

    onTouchHandler:function(obj,type){
        if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            var touchPoint = this.getTouchEndPosition();
            touchPoint = this.convertToNodeSpace(touchPoint);
            var x = Math.floor(touchPoint.x/67)
            var y = Math.floor(touchPoint.y/67)
            WZQRoomModel.sendPlayCardMsg([parseInt(x),parseInt(y)])
        }
    },
    setChess:function(root,cardIds){
        for(var i = 0;i < cardIds.length;i++){
            this.addChess(root,cardIds[i])
        }
    },

    addChess:function(root,cardId){
        this.root = root
        var chessStr = cardId[2] == 1 ? "baizi" : "heizi"
        var chess = new cc.Sprite("res/res_wzq/"+chessStr+".png");
        chess.x = 33 + cardId[0]*this._chessW
        chess.y = 33 + cardId[1]*this._chessW
        this.root.addChild(chess)
    },
}
