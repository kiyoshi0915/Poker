//プレイヤーを扱うクラス

//**********************************
//プレイヤークラス
//**********************************
function Player(arg_CardDeck) {
    //クラス変数
    Player.HANDSIZE = 5;  //初期手札枚数

    //メンバ
    this.cardDeck = arg_CardDeck; //使用するカードデッキ
    this.hand;      //手札

    this.initialize.apply(this, arguments); //コンストラクタ適用
}

//**********************************
//コンストラクタ
//arg_CardDeck：カードデッキ
//**********************************
Player.prototype.initialize = function (arg_CardDeck) {
    this.clearHand();
}

//**********************************
//手札クリア
//**********************************
Player.prototype.clearHand = function () {
    this.hand = new Array();
    for (var i = 0; i < Player.HANDSIZE; i++)
        this.hand.push(new Card(Card.NONE.IDX));
}

//**********************************
//カードドロー(１枚)
//arg_isFace：true=表、false=裏向きでドロー
//**********************************
Player.prototype.drawCard = function (arg_isFace) {
    var isFace = (arg_isFace != undefined) ? arg_isFace : true;
    var wkCard;
    if ((wkCard = this.cardDeck.nextCard(isFace)) == CardDeck.CARDNONE) {
        alert("カードデッキがありません。");
        return CardDeck.CARDNONE;
    }
    //手札にカードを追加
    this.hand.push(wkCard);
}

//**********************************
//手札にカードをセット
//arg_isFace：true=表、false=裏向きでドロー
//arg_intHandSize:ドロー後の手札枚数
//**********************************
Player.prototype.setHand = function (arg_isFace, arg_intHandSize) {
    var isFace = (arg_isFace != undefined) ? arg_isFace : true;
    var intHandSize = arg_intHandSize ? arg_intHandSize : Player.HANDSIZE;
    var intHandSizeBef; //ドロー前の手札枚数

    //※通常は素通りのためコメントアウト
    //Player.HANDSIZEになるまでCard(Card.NONE.IDX)がセットされるため
    //    //設定された手札枚数の要素数になるまでカードをドロー
    //    if (this.hand.length < intHandSize) { 
    //        intHandSizeBef = this.hand.length;
    //        for (var i = 0; i < intHandSize - intHandSizeBef; i++) this.drawCard(isFace);
    //    }

    //「カードなし」分だけドロー
    for (var i = 0; i < this.hand.length; i++) {
        if (this.hand[i].index == Card.NONE.IDX) {
            var wkCard = this.cardDeck.nextCard(isFace);
            if (wkCard !== CardDeck.CARDNONE) this.hand.splice(i, 1, wkCard);
        }
    }
}

//**********************************
//手札をソート
//arg_type：ソートタイプ(1(def)=強さ順、2=同じ数字の多い順、強さ順)
//**********************************
Player.prototype.sortHand = function (arg_type) {
    var type = arg_type || 1;
    //エース始まりのストレートの場合のみエースを先頭に持ってくる
    if (PokerHand.chkStraight(this.hand) == PokerHand.STRAIGHT_ACE) {
        this.hand.sortByCardNum(); //カード数字ソート
    } else {
        if (type == 1) this.hand.sortByCardStg(); //カードの強さ順ソート
        else if (type == 2) this.hand.sortByCardCntStg(); //同じ数字の多い順、強い順ソート
    }
}

//**********************************
//手札のカードのドロップフラグを立てる
//arg_arrIsChange：変更フラグ配列
//(ex:[true,true,false,false,false] 
//**********************************
Player.prototype.setDropFlg = function (arg_arrIsChange) {
    this.hand.setDropFlg(arg_arrIsChange);
}

//**********************************
//ドロップフラグの立っているカード全てを捨てる
//**********************************
Player.prototype.dropCardsByDropFlg = function () {
    this.hand.dropCardsByDropFlg();
}

//**********************************
//ドロップフラグの立っているカードを表(裏)にする
//それ以外のカードは裏(表)にする
//arg_toFace：true=表、false=裏にする
//**********************************
Player.prototype.setFaceByDropFlg = function (arg_isFace) {
    this.hand.setFaceByDropFlg(arg_isFace);
}

//**********************************
//手札の有効カード以外のカードのドロップフラグを立てる
//arg_PKHand：ポーカーハンドインスタンス
//**********************************
Player.prototype.dropCardByThink = function (arg_PKHhand) {
    if (!arg_PKHhand instanceof PokerHand) return;
    var PKHand = arg_PKHhand;

    //役を考慮
    //ストレート以上は捨てるカードなし
    if (PKHand.PKHand >= PokerHand.STRAIGHT) return;

    //手札から捨てるカードを選出し、捨てる
    //Priority１：フラッシュ狙い
    if (this.hand.cntCardBySuit(PKHand.arrValidSuit) >= 4) //同じスートが４枚以上
    { this.hand.holdCardByCardSuit(PKHand.arrValidSuit); return; }

    //Priority２：ストレート狙い
    if (PKHand.arrValidCardNumST.length >= 4) //ストレート構成札が４枚以上
    { this.hand.holdCardByCardNumArr(PKHand.arrValidCardNumST, false); return; }

    //Priority３：フルハウス狙い
    this.hand.holdCardByCardNumArr(PKHand.arrValidCardNumFH, true);
}

//##################################################################
//※以下は今回未使用（今後使うときが来るかもしれないので残しておく）
//##################################################################

////**********************************
////手札からカードを捨てる
////arg_arrIsChange：変更フラグ配列
////(ex:[true,true,false,false,false] 
////**********************************
//Player.prototype.dropCard = function (arg_arrIsChange) {
//    this.hand.dropCard(arg_arrIsChange);
//}

////**********************************
////手札のカードを表or裏に変える
////arg_arrIsChange：変更フラグ配列
////(ex:[true,true,false,false,false] 
////**********************************
//Player.prototype.setFace = function (arg_arrIsChange) {
//    this.hand.setFace(arg_arrIsChange);
//}

////**********************************
////カード全てを表or裏に変える
////arg_toFace：true=表、false=裏へ変える
////**********************************
//Player.prototype.setFaceAll = function (arg_toFace) {
//    var toFace = (arg_toFace != undefined) ? arg_toFace : true;
//    this.hand.setFaceAll(arg_toFace);
//}

////**********************************
////表or裏のカードを全て捨てる
////arg_isFace：true=表、false=裏のカードを捨てる
////**********************************
//Player.prototype.dropByFace = function (arg_isFace) {
//    if (arg_isFace == undefined) return;
//    for (var i = 0; i < this.hand.length; i++)
//        if (this.hand[i].isFace == arg_isFace) this.hand[i].drop();
//}