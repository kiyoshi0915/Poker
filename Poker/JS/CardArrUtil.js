//Card配列のためのメソッド

//**********************************
//カード配列のカード情報を返す
//**********************************
Array.prototype.getInfo = function () {
    var strInfo = "";
    for (var i = 0; i < this.length; i++) {
        strInfo += this[i].getInfo(); strInfo += "\n";
    }
    return strInfo
}

//**********************************
//カードをインデックス順にソート
//**********************************
Array.prototype.sortByCardIdx = function () {
    this.sort(function (a, b) {
        return (parseInt(a.index) > parseInt(b.index)) ? 1 : -1;
    });
}

//**********************************
//カードの数字順にソート
//[A][2]…[13][JK]
//**********************************
Array.prototype.sortByCardNum = function () {
    this.sort(function (a, b) {
        //数字順、スート順になるようにソート       
        //カードの数字比較
        if (a.num > b.num) return 1;
        if (a.num < b.num) return -1;
        
        //同位札の場合
        //カードのスート比較
        if (a.suit > b.suit) return 1;
        if (a.suit < b.suit) return -1;

        alert("同じカード存在" + " : " + "sortByCardNum");
        alert(a.getInfo() + "\n" + b.getInfo());
        return G_ERROR;
    });
}

//**********************************
//カードの強さ順にソート
//[2][3]…[13][A][JK]
//**********************************
Array.prototype.sortByCardStg = function () {
    this.sort(function (a, b) {
        //強さ順、スート順になるようにソート
        //カードの強さ比較
        if (a.stg > b.stg) return 1;
        if (a.stg < b.stg) return -1;

        //同位札の場合
        //カードのスート比較
        if (a.suit > b.suit) return 1;
        if (a.suit < b.suit) return -1;

        alert("同じカード存在" + " : " + "sortByCardStg");
        alert(a.getInfo() + "\n" + b.getInfo());
        return G_ERROR;
    });
}

//**********************************
//カードを同じ数字の多い順、強い順にソート
//**********************************
Array.prototype.sortByCardCntStg = function () {
    var arrCardStg = new Array();
    for (var i = 0; i < this.length; i++) arrCardStg.push(this[i].stg);

    this.sort(function (a, b) {
        //同じ数字の多い順、強い順になるようにソート
        //同じ数字の枚数比較
        if (arrCardStg.cntElm(a.stg) > arrCardStg.cntElm(b.stg)) return 1;
        if (arrCardStg.cntElm(a.stg) < arrCardStg.cntElm(b.stg)) return -1;

        //カードの強さ比較
        if (a.stg > b.stg) return 1;
        if (a.stg < b.stg) return -1;

        //同位札の場合
        //カードのスート比較
        if (a.suit > b.suit) return 1;
        if (a.suit < b.suit) return -1;

        alert("同じカード存在" + " : " + "sortByCardStg");
        alert(a.getInfo() + "\n" + b.getInfo());
        return G_ERROR;
    });
}

//**********************************
//指定されたインデックスのカードが入っているかを返す
//**********************************
Array.prototype.containsByCardIdx = function (arg_cardIdx) {
    for (var i = 0; i < this.length; i++)
        if (this[i].index == arg_cardIdx) return true;
    return false;
}

//**********************************
//指定された数字のカードが入っているかを返す
//**********************************
Array.prototype.containsByCardNum = function (arg_cardNum) {
    for (var i = 0; i < this.length; i++)
        if (this[i].num == arg_cardNum) return true;
    return false;
}

//**********************************
//指定されたスートのカードが何枚入っているかを返す
//**********************************
Array.prototype.cntCardBySuit = function (arg_cardSuit) {
    var cardSuit = (arg_cardSuit instanceof Array) ? arg_cardSuit[0] : arg_cardSuit;
    var cnt = 0;
    for (var i = 0; i < this.length; i++)
        if (this[i].suit == cardSuit) cnt++;
    return cnt;
}

//**********************************
//変更フラグ配列指定でカードのドロップフラグを立てる
//arg_arrIsChange：変更フラグ配列
//(ex:[true,true,false,false,false] 
// -> １，２枚目のdropFlgがtrueになる)
//**********************************
Array.prototype.setDropFlg = function (arg_arrIsChange) {
    for (var i = 0; i < arg_arrIsChange.length; i++)
        if (arg_arrIsChange[i]) this[i].setDropFlg(true);
}

//**********************************
//ドロップフラグの立っているカード全てを捨てる
//**********************************
Array.prototype.dropCardsByDropFlg = function () {
    for (var i = 0; i < this.length; i++)
        this[i].drop(true);
}

//**********************************
//ドロップフラグの立っているカードを表(裏)にする
//それ以外のカードは裏(表)にする
//arg_toFace：true=表、false=裏にする
//**********************************
Array.prototype.setFaceByDropFlg = function (arg_toFace) {
    if (arg_toFace == undefined) return;

    for (var i = 0; i < this.length; i++)
        if (this[i].dropFlg) this[i].setFace(arg_toFace);
        else this[i].setFace(!arg_toFace);
}

//**********************************
//指定された数字配列のカード以外の全ての
//カードのドロップフラグを立てる
//arg_cardNumArr：数字配列
//arg_isAllOfNum：true=数字配列内の各数字を全て保持
//                false=数字配列内の各数字の要素数分だけ保持
//arg_isHoldJoker：true=Jokerはドロップフラグ成立の対象外
//                 false=対象内
//**********************************
Array.prototype.holdCardByCardNumArr = function (arg_cardNumArr, arg_isAllOfNum, arg_isHoldJoker) {
    if (arg_cardNumArr == undefined) return;

    var cardNumArr = new Array(); cardNumArr.copy(arg_cardNumArr);
    var isAllOfNum = (arg_isAllOfNum != undefined) ? arg_isAllOfNum : false;
    var isHoldJoker = (arg_isHoldJoker != undefined) ? arg_isHoldJoker : true;

    for (var i = 0; i < this.length; i++) {
        if ((isHoldJoker) && (this[i].num == Card.JK.NUM)) continue; //Jokerは残す
        if (cardNumArr.length == 0) { this[i].setDropFlg(true); continue; }
        for (var j = 0; j < cardNumArr.length; j++)
            if (!cardNumArr.contains(this[i].num)) //指定配列になければフラグ成立
                this[i].setDropFlg(true);
            else                                   //指定配列になければそのまま
                if (!isAllOfNum) { cardNumArr.splice(j, 1); break; } //要素数考慮のときは指定配列から要素削除
    }
}

//**********************************
//指定されたスートのカード以外のカード全ての
//ドロップフラグを立てる
//arg_cardSuit：残すスート
//arg_isHoldJoker：true=Jokerはドロップフラグ成立の対象外
//                 false=対象内
//**********************************
Array.prototype.holdCardByCardSuit = function (arg_cardSuit, arg_isHoldJoker) {
    var cardSuit = (arg_cardSuit instanceof Array) ? arg_cardSuit[0] : arg_cardSuit;
    var isHoldJoker = (arg_isHoldJoker != undefined) ? arg_isHoldJoker : true;

    for (var i = 0; i < this.length; i++) {
        if ((!isHoldJoker) && (this[i].suit == Card.JK.SUIT)) this.setDropFlg(true);
        else if ((this[i].suit != arg_cardSuit) && (this[i].suit != Card.JK.SUIT)) this[i].setDropFlg(true);
    }
}

//##################################################################
//※以下は今回未使用（今後使うときが来るかもしれないので残しておく）
//##################################################################

////**********************************
////変更フラグ配列指定でカードを捨てる
////arg_arrIsChange：変更フラグ配列
////(ex:[true,true,false,false,false] 
//// -> １，２枚目が交換対象なので「カードなし」になる)
////**********************************
//Array.prototype.dropCard = function (arg_arrIsChange) {
//    for (var i = 0; i < arg_arrIsChange.length; i++)
//        if (arg_arrIsChange[i]) this[i].drop();
//}

////**********************************
////変更フラグ配列指定でカードを表or裏へ変える
////arg_arrIsChange：変更フラグ配列
////(ex:[true,true,false,false,false] 
//// -> １，２枚目が表、それ以外が裏へ変わる
////**********************************
//Array.prototype.setFace = function (arg_arrIsChange) {
//    for (var i = 0; i < arg_arrIsChange.length; i++)
//        this[i].setFace(arg_arrIsChange[i]);
//}

////**********************************
////カード全てを表or裏に変える
////arg_toFace：true=表、false=裏へ変える
////**********************************
//Array.prototype.setFaceAll = function (arg_toFace) {
//    var toFace = (arg_toFace != undefined) ? arg_toFace : true;
//    for (var i = 0; i < this.length; i++) this[i].setFace(toFace);
//}