//トランプのカード（一枚）を扱う

//**********************************
//カードクラス
//**********************************
function Card(arg_index) {
    //クラス変数
    Card.MAXNUM = 13;  //通常カードの最大数字
    Card.SUIT = {      //スート
        SP: 3,         //スペード
        HT: 2,         //ハート
        DI: 1,         //ダイヤ
        CL: 0          //クラブ
    };
    Card.JK = {        //ジョーカー
        IDX: 52,       //ジョーカーのインデックス
        NUM: 15,       //ジョーカーの数字
        STG: 15,       //ジョーカーの強さ
        SUIT: 4        //ジョーカーのスート
    };                 
    Card.NONE = {      //カードなし(カードを持っていないところに入れる)
        IDX: -1,       //カードなしのインデックス
        NUM: -1,       //カードなしの数字
        STG: -1,       //カードなしの強さ
        SUIT: -1       //カードなしのスート
    };

    //メンバ
    //カードインデックス
    this.index;
    //カードの数字([A]=1,[2]=2,…[K]=13,[JK]=15)
    this.num;
    //カードの強さ([2]=2,…,[K]=13,[A]=14,[JK]=15)
    this.stg;
    //カードのスート
    this.suit;
    //カードの表裏
    this.isFace;
    //カードドロップフラグ
    this.dropFlg;
    //カードの画像ファイル文字列
    this.imgStr;
    //カード情報
    this.getInfo;

    //コンストラクタ適用
    this.initialize.apply(this, arguments); 
}

//**********************************
//コンストラクタ
//arg_index：カードインデックス
//**********************************
Card.prototype.initialize = function (arg_index) {
    //カードインデックス
    this.index = arg_index;
    //カードの数字([A]=1,[2]=2,…[K]=13,[JK]=15)
    this.num = (function () {
        if (arg_index == Card.JK.IDX) return Card.JK.NUM;
        if (arg_index == Card.NONE.IDX) return Card.NONE.NUM;
        return Math.floor(arg_index % Card.MAXNUM) + 1;
    })();

    //カードの強さ([2]=2,…,[K]=13,[A]=14,[JK]=15)
    this.stg = (function () {
        if (arg_index == Card.JK.IDX) return Card.JK.STG;
        if (arg_index == Card.NONE.IDX) return Card.NONE.STG;
        if ((Math.floor(arg_index % Card.MAXNUM) + 1) == 1) return Card.MAXNUM + 1; //エースの強さはキングのひとつ上
        return Math.floor(arg_index % Card.MAXNUM) + 1;
    })();

    //カードのスート
    this.suit = (function () {
        if (arg_index == Card.JK.IDX) return Card.JK.SUIT;
        if (arg_index == Card.NONE.IDX) return Card.NONE.SUIT;
        return Math.floor(arg_index / Card.MAXNUM);
    })();

    //カードの表裏
    this.isFace = true;

    //カードドロップフラグ
    this.dropFlg = false;

    //カードの画像ファイル文字列
    this.imgStr = this.getImgStr();

    //カード情報
    this.getInfo = function () {
        return "Index:" + this.index + ", スート:" + this.suitByStr() + ", 数字:" + this.num;
    };
}

//**********************************
//カードの表裏設定
//arg_isFace：true=表、false=裏
//**********************************
Card.prototype.setFace = function (arg_isFace) {
    var isFace = (arg_isFace != undefined) ? arg_isFace : true;
    if (this.index != Card.NONE.IDX) {
        this.isFace = isFace;
        this.imgStr = this.getImgStr();
    }
}

//**********************************
//カードドロップフラグ設定
//arg_isDrop：true=フラグON、false=OFF
//**********************************
Card.prototype.setDropFlg = function (arg_isDrop) {
    this.dropFlg = (arg_isDrop != undefined) ? arg_isDrop : true;
}

//**********************************
//カードを捨てる
//arg_chkFlg：true=ドロップフラグチェックあり、false=なし
//**********************************
Card.prototype.drop = function (arg_chkFlg) {
    var chkFlg = (arg_chkFlg != undefined) ? arg_chkFlg : false;
    if ((!chkFlg) || (chkFlg && this.dropFlg)) {
        this.index = Card.NONE.IDX;
        this.num = Card.NONE.NUM;
        this.stg = Card.NONE.STG;
        this.suit = Card.NONE.SUIT;
        this.setFace(false);
    }
}

//**********************************
//カードのスートを文字列で返す
//**********************************
Card.prototype.suitByStr = function () {
    switch (this.suit) {
        case Card.SUIT.SP: return "スペード" ;  break;
        case Card.SUIT.HT: return "ハート";     break;
        case Card.SUIT.DI: return "ダイヤ";     break;
        case Card.SUIT.CL: return "クラブ";     break;
        case Card.JK.SUIT: return "ジョーカー"; break;
    };
}

//**********************************
//カード画像名取得
//**********************************
Card.prototype.getImgStr = function () {
    var strSuit = "";

    //裏の場合
    if (!this.isFace) return "z01";
    //Jokerの場合
    if (this.suit == Card.JK.SUIT) return "jo";

    //一般
    switch (this.suit) {
        case Card.SUIT.SP: strSuit = "s"; break;
        case Card.SUIT.HT: strSuit = "h"; break;
        case Card.SUIT.DI: strSuit = "d"; break;
        case Card.SUIT.CL: strSuit = "c"; break;
    };
    return strSuit + ("0" + this.num).slice(-2);
}