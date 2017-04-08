//カードデッキ１組を扱うクラス

//**********************************
//カードデッキクラス
//**********************************
function CardDeck(arg_blnUseJoker) {
    //クラス変数
    CardDeck.CARDNONE = -1;      //カードなしを表す

    //メンバ
    this.cardArr;               //Card配列
    this.cardCntByDeck;         //１デッキのカード枚数

    //コンストラクタ適用
    this.initialize.apply(this, arguments); 
}
//**********************************
//コンストラクタ
//arg_blnUseJoker：ジョーカー使用フラグ
//**********************************
CardDeck.prototype.initialize = function (arg_blnUseJoker) {
    //１デッキのカード枚数設定
    this.cardCntByDeck = arg_blnUseJoker ? 53 : 52;
    //Card配列設定
    this.cardArr = new Array(this.cardCntByDeck)
    for (var i = 0; i < this.cardCntByDeck; i++) this.cardArr[i] = new Card(i);
}

//**********************************
//カードの残り枚数を返す
//**********************************
CardDeck.prototype.size = function () {
    return this.cardArr.length;
}
//**********************************
//ランダムに次のカードを引く
//arg_isFace：true=表、false=裏向きでドロー
//**********************************
CardDeck.prototype.nextCard = function (arg_isFace) {
    var isFace = (arg_isFace != undefined) ? arg_isFace : true;
    var intRand; //乱数格納用
    var wkCard;  //Card格納用

    //カード枚数チェック
    if (this.size() == 0) return CardDeck.CARDNONE;
    //ランダムにデッキ内のカードを選ぶ
    intRand = Math.floor(Math.random() * this.size());
    wkCard = this.cardArr[intRand];
    //選んだカードはデッキから削除
    this.cardArr.splice(intRand, 1);
    //表裏を設定
    wkCard.setFace(isFace);
    //選んだカードを返す
    return wkCard;
}