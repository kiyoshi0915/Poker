//ポーカーハンド(役)の判定を行うクラス

//**********************************
//ポーカーハンドクラス
//**********************************
function PokerHand(arg_hand) {
    //クラス変数
    //ポーカーハンド
    //※ビット演算で表現
    PokerHand.HANDERR         = -1;                                   //手札エラー
    PokerHand.NOPKHAND        = 0;                                    //役なし判定※判定処理で便宜的に使用 
    PokerHand.HIGHCARD        = 1;                                    //ノーハンド(ハイカード)
    PokerHand.ONEPAIR         = 1 << 1;                               //ワンペア
    PokerHand.TWOPAIR         = 1 << 2;                               //ツーペア
    PokerHand.THREECARD       = 1 << 3;                               //スリーカード
    PokerHand.STRAIGHT        = 1 << 4;                               //ストレート
    PokerHand.STRAIGHT_NORMAL = 1 << 5 | PokerHand.STRAIGHT;          //ストレート(通常)  ※判定処理で便宜的に使用
    PokerHand.STRAIGHT_ACE    = 1 << 6 | PokerHand.STRAIGHT;          //ストレート(A先頭) ※判定処理で便宜的に使用
    PokerHand.FLUSH           = 1 << 7;                               //フラッシュ
    PokerHand.FULLHOUSE       = 1 << 8;                               //フルハウス
    PokerHand.FOURCARD        = 1 << 9;                               //フォーカード
    PokerHand.STRAIGHT_FLUSH  = 1 << 10;                              //ストレートフラッシュ
    PokerHand.FIVECARD        = 1 << 11;                              //ファイブカード
    PokerHand.ROYAL_STRAIGHT_FLUSH = 1 << 12;                         //ローヤルストレートフラッシュ
    //ポーカーハンド比較結果
    PokerHand.CMP = {
        WIN: 1,
        DROW: 2,
        LOSE: 3
    };

    //メンバ
    //対象手札
    this.hand;
    //有効スート
    this.arrValidSuit;
    //有効数字配列(ストレート用)
    this.arrValidCardNumST;
    //有効数字配列(フルハウス系用)
    this.arrValidCardNumFH;
    //判定用カード強さ配列(同じ役同士で強さを判定するときに使用)
    this.arrJudgeStg;
    //ポーカーハンド情報(クラス変数で定義されたものを保持)
    this.PKHand;
    //ポーカーハンド情報(文字列)
    this.PKHandStr;
    //Joker保持フラグ
    this.hasJoker;

    //コンストラクタ適用
    this.initialize.apply(this, arguments);

    //**********************************
    //ポーカーハンドの強さ比較
    //arg_pkHand1：ポーカーハンド１
    //arg_pkHand2：ポーカーハンド２
    //arg_isJKLose：ジョーカー保持負けフラグ
    //ポーカーハンド１が勝ちのときPokerHand.CMP.WIN、
    //       　     引き分けのときPokerHand.CMP.DROW、
    //                  負けのときPokerHand.CMP.LOSE
    //**********************************
    PokerHand.cmpPKHand = function (arg_pkHand1, arg_pkHand2, arg_isJKLose) {
        var isJKLose = (arg_isJKLose != undefined) ? arg_isJKLose : true;

        //役の強弱で判定
        if (arg_pkHand1.PKHand > arg_pkHand2.PKHand) return PokerHand.CMP.WIN;
        if (arg_pkHand1.PKHand < arg_pkHand2.PKHand) return PokerHand.CMP.LOSE;

        if (isJKLose) {
            //Jokerの有無で判定
            if (arg_pkHand1.hasJoker) return PokerHand.CMP.LOSE;
            if (arg_pkHand2.hasJoker) return PokerHand.CMP.WIN;
        }
        //主要部、キッカーで判定
        for (var i = 0; i < arg_pkHand1.arrJudgeStg.length; i++) {
            if (arg_pkHand1.arrJudgeStg[i] > arg_pkHand2.arrJudgeStg[i]) return PokerHand.CMP.WIN;
            if (arg_pkHand1.arrJudgeStg[i] < arg_pkHand2.arrJudgeStg[i]) return PokerHand.CMP.LOSE;
        }
        //それでも決まらない場合はドロー
        return PokerHand.CMP.DROW;
    }

    //**********************************
    //ポーカーハンドを文字列で返す
    //arg_PKHand=ポーカーハンド情報
    //**********************************
    PokerHand.getPKHandByStr = function (arg_PKHand) {
        if (arg_PKHand == PokerHand.HIGHCARD)               return "ノーペア";
        if (arg_PKHand == PokerHand.ONEPAIR)                return "ワンペア";
        if (arg_PKHand == PokerHand.TWOPAIR)                return "ツーペア";
        if (arg_PKHand == PokerHand.THREECARD)              return "スリーカード";
        if (arg_PKHand == PokerHand.STRAIGHT)               return "ストレート";
        if (arg_PKHand == PokerHand.FLUSH)                  return "フラッシュ";
        if (arg_PKHand == PokerHand.FULLHOUSE)              return "フルハウス";
        if (arg_PKHand == PokerHand.FOURCARD)               return "フォーカード";
        if (arg_PKHand == PokerHand.STRAIGHT_FLUSH)         return "ストレートフラッシュ";
        if (arg_PKHand == PokerHand.FIVECARD)               return "ファイブカード";
        if (arg_PKHand == PokerHand.ROYAL_STRAIGHT_FLUSH)   return "ローヤルストレートフラッシュ";
        if (arg_PKHand == PokerHand.NOPKHAND)               return "手札エラー";

        return G_ERROR; //その他はエラー
    }

    //**********************************
    //ポーカーハンドを返す
    //arg_hand=プレイヤーの手札
    //ref_validSuit：有力スート
    //ref_arrValidCardNumST：有効数字配列(ストレート用)
    //ref_arrValidCardNumFH：有効数字配列(フルハウス系用)
    //ref_arrJudgeStg：判定用カード強さ配列
    //**********************************
    PokerHand.chkPKFunc = function (arg_hand, ref_arrValidSuit,
                   ref_arrValidCardNumST, ref_arrValidCardNumFH, ref_arrJudgeStg) {
        var hand = new Array(); hand.copy(arg_hand);
        var intPKHand = 0;                   //役判定用
        var arrJudgeStgFL = new Array();     //フラッシュ判定のカードの強さ配列
        var arrJudgeStgST = new Array();     //ストレート判定のカードの強さ配列
        var arrJudgeStgFH = new Array();     //フルハウス系判定のカードの強さ配列

        //手札５枚以外はエラー
        if (hand.length != 5) return PokerHand.HANDERR;

        //判定処理
        intPKHand += PokerHand.chkFlush(hand, ref_arrValidSuit, arrJudgeStgFL);             //フラッシュ
        intPKHand += PokerHand.chkStraight(hand, ref_arrValidCardNumST, arrJudgeStgST);     //ストレート
        intPKHand += PokerHand.chkFullHouseETC(hand, ref_arrValidCardNumFH, arrJudgeStgFH); //フルハウス系

        //役として有効な値、判定用カード強さ配列を返す(ex:ワンペア&フラッシュ->フラッシュを返す)
        if (containsByBit(intPKHand, PokerHand.STRAIGHT_ACE | PokerHand.FLUSH))     { intPKHand = PokerHand.ROYAL_STRAIGHT_FLUSH;   ref_arrJudgeStg.copy(arrJudgeStgST); }
        else if (containsByBit(intPKHand, PokerHand.FIVECARD))                      { intPKHand = PokerHand.FIVECARD;               ref_arrJudgeStg.copy(arrJudgeStgFH); }
        else if (containsByBit(intPKHand, PokerHand.STRAIGHT | PokerHand.FLUSH))    { intPKHand = PokerHand.STRAIGHT_FLUSH;         ref_arrJudgeStg.copy(arrJudgeStgST); }
        else if (containsByBit(intPKHand, PokerHand.FOURCARD))                      { intPKHand = PokerHand.FOURCARD;               ref_arrJudgeStg.copy(arrJudgeStgFH); }
        else if (containsByBit(intPKHand, PokerHand.FULLHOUSE))                     { intPKHand = PokerHand.FULLHOUSE;              ref_arrJudgeStg.copy(arrJudgeStgFH); }
        else if (containsByBit(intPKHand, PokerHand.FLUSH))                         { intPKHand = PokerHand.FLUSH;                  ref_arrJudgeStg.copy(arrJudgeStgFL); }
        else if (containsByBit(intPKHand, PokerHand.STRAIGHT))                      { intPKHand = PokerHand.STRAIGHT;               ref_arrJudgeStg.copy(arrJudgeStgST); }
        else if (intPKHand == PokerHand.NOPKHAND)                                   { intPKHand = PokerHand.HIGHCARD;               ref_arrJudgeStg.copy(arrJudgeStgFH); }
        else                                                                        {                                               ref_arrJudgeStg.copy(arrJudgeStgFH); }

        //ポーカーハンドを返す
        return intPKHand;
    }

    //**********************************
    //フラッシュ判定
    //arg_hand：手札(Card配列)
    //ref_validSuit：有力スート
    //ref_arrJudgeStgFL：判定用カード強さ配列
    //**********************************
    PokerHand.chkFlush = function (arg_hand, ref_validSuit, ref_arrJudgeStgFL) {
        var hand = arg_hand;
        var funcRtn = PokerHand.NOPKHAND; //戻り値用
        var arrCardSuit = new Array();    //スート配列
        var intManySuit = -1;             //最多スート
        var intMaxCntElm = -1;            //最多スートのカード枚数
        var arrCardStg = new Array();     //カード強さ配列

        //カードスート配列設定
        for (var i = 0; i < hand.length; i++) arrCardSuit.push(hand[i].suit);

        //最多スート、最多スートの枚数を取得
        var wkCntElm = 0;
        for (var kind in Card.SUIT)
            if (intMaxCntElm < (wkCntElm = arrCardSuit.cntElm(Card.SUIT[kind]))) {
                intManySuit = Card.SUIT[kind]; intMaxCntElm = wkCntElm; 
             }

        //Jokerがある場合はカウントアップ
        if (arrCardSuit.contains(Card.JK.SUIT)) intMaxCntElm++;

        //カウンタが5のときはフラッシュと判定
        if (intMaxCntElm == 5) funcRtn = PokerHand.FLUSH;

        //有効スート設定
        ref_validSuit.copy([intManySuit]);

        if (ref_arrJudgeStgFL != undefined) {
            //判定用カード強さ配列設定
            //カード強さ配列作成
            for (var i = 0; i < hand.length; i++) arrCardStg.push(hand[i].stg);
            //カード強さ配列を要素数、強さ順にソート
            arrCardStg.sortByCntElmNum();
            ref_arrJudgeStgFL.copy(arrCardStg);
        }

        return funcRtn;
    }

    //**********************************
    //ストレート判定
    //arg_hand：手札(Card配列)
    //ref_arrValidCardNumST：有効数字配列
    //ref_arrJudgeStgST：判定用カード強さ配列
    //**********************************
    PokerHand.chkStraight = function (arg_hand, ref_arrValidCardNumST, ref_arrJudgeStgST) {
        var hand = arg_hand;
        var funcRtn = PokerHand.NOPKHAND; //戻り値用
        var arrCardNum = new Array();     //カード数字配列
        var ARRACE = new Array(1, 10, 11, 12, 13); //エースストレートの数字配列
        var arrMinST = new Array();       //小さい数字で始まるストレート
        var arrMaxST = new Array();       //大きい数字で終わるストレート
        var wkArrAce = new Array();       //ワーク用
        var wkArrMinST = new Array();     //ワーク用
        var wkArrMaxST = new Array();     //ワーク用
        var wkNum;                        //ワーク用

        //カード数字配列設定([A]は14ではなく1扱い)
        for (var i = 0; i < hand.length; i++) arrCardNum.push(hand[i].num);
        //数値の小さい順にソート
        arrCardNum.sortByNumber();

        //エースストレートの判定
        //合致する数字を持つ配列を設定
        wkArrAce = arrCardNum.holdByArrElm(ARRACE);
        //全て一致
        if (wkArrAce.length == 5) funcRtn = PokerHand.STRAIGHT_ACE; //エースストレートと判定
        //Jokerありのとき
        else if (arrCardNum.contains(Card.JK.NUM)) {
            switch (wkArrAce.length) {
                case 4: //エースストレートの配列と４個一致
                    funcRtn = PokerHand.STRAIGHT_ACE; //エースストレートと判定
                    // breakしない
                case 3: //エースストレートの配列と３or２個一致
                case 2:
                    //Jokerを置換
                    for (var i = 0; i < ARRACE.length; i++) {
                        if (!wkArrAce.contains(ARRACE[i])) {
                            wkArrAce.splice(i, 0, ARRACE[i]);
                            break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        //ノーマルストレートの判定
        if (funcRtn == PokerHand.NOPKHAND) {
            //小さい数字で始まるストレートの判定
            wkNum = arrCardNum[0];
            //手札の最も小さい数字から始まるストレートの数字配列を作成
            for (var i = 0; i < arrCardNum.length; i++) arrMinST.push(wkNum++);
            //合致する数字を持つ配列を設定
            wkArrMinST = arrCardNum.holdByArrElm(arrMinST);
            //ストレートの配列と一致
            if (wkArrMinST.length == 5) funcRtn = PokerHand.STRAIGHT_NORMAL; //ストレートと判定
            //Jokerありのとき
            else if (arrCardNum.contains(Card.JK.NUM)) {
                switch (wkArrMinST.length) {
                    case 4: //ストレートの配列と４個一致
                        funcRtn = PokerHand.STRAIGHT_NORMAL; //ストレートと判定
                        // breakしない
                    case 3: //ストレートの配列と３or２個一致
                    case 2:
                        //Jokerを置換
                        for (var i = 0; i < wkArrMinST.length; i++) {
                            if (wkArrMinST[i] + 1 != wkArrMinST[i + 1]) {
                                wkNum = (wkArrMinST[i] + 1 != 14) ? (wkArrMinST[i] + 1) : 1; //Aceの数字は1
                                wkArrMinST.splice(i + 1, 0, wkNum);
                                break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        //大きい数字で終わるストレートの判定
        //※有効数字配列設定時、手札の一番小さい数字始まり以外のケースを拾うため(ex:[2][5][6][7][8])
        if (arrCardNum[arrCardNum.length - 1] >= 5 && funcRtn == PokerHand.NOPKHAND) {
            wkNum = (arrCardNum.contains(Card.JK.NUM)) ? (arrCardNum[arrCardNum.length - 2]) : (arrCardNum[arrCardNum.length - 1]);
            //手札の最も大きい数字で終わるストレートの数字配列を作成
            for (var i = 0; i < arrCardNum.length; i++) arrMaxST.unshift(wkNum--);
            //合致する数字を持つ配列を設定
            wkArrMaxST = arrCardNum.holdByArrElm(arrMaxST);
            //※ストレートかどうかの判定結果は小さい数字始まりのところで拾えるので、ここでは処理しない
            //Jokerありのとき
            if (arrCardNum.contains(Card.JK.NUM)) {
                switch (wkArrMaxST.length) {
                    case 3: //ストレートの配列と３or２個一致
                    case 2:
                        //Jokerを置換
                        for (var i = 0; i < wkArrMaxST.length; i++) {
                            if (wkArrMaxST[i] + 1 != wkArrMaxST[i + 1]) {
                                wkNum = (wkArrMaxST[i] + 1 != 14) ? (wkArrMaxST[i] + 1) : 1; //Aceの数字は1
                                wkArrMaxST.splice(i + 1, 0, wkNum);
                                break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        //有効数字配列設定
        if (ref_arrValidCardNumST != undefined) {
            var isSeted = false; //※英文法的にはisSetが正
            if (wkArrAce.length == 5) {
                //エースストレートの場合は設定値固定
                ref_arrValidCardNumST.copy(ARRACE);
                isSeted = true;
            } else {
                //連続した数が４つ続いているものを優先的に設定
                for (var i = 0; i < 2; i++) {
                    var arr; //このループ内でチェックする配列を設定                    
                    if (i == 0) arr = wkArrMinST;
                    else if (i == 1) arr = wkArrMaxST;
                    //数字の連続判定
                    if (arr.length == 4) {
                        if ((arr[1] == arr[0] + 1) && (arr[2] == arr[0] + 2) && (arr[3] == arr[0] + 3)) {
                            ref_arrValidCardNumST.copy(arr);
                            isSeted = true;
                        }
                    }
                }
            }
            //要素数が多いものを採用
            if (!isSeted) {
                var wkArr = ((wkArrMinST.length >= wkArrMaxST.length) &&
                             (wkArrMinST.length >= wkArrAce.length)) ? wkArrMinST :
                            (wkArrMaxST.length >= wkArrAce.length) ? wkArrMaxST : wkArrAce;
                ref_arrValidCardNumST.copy(wkArr);
            }
        }

        //判定用カード強さ配列設定
        //※ストレート同士を比べるとき使うのが前提なので、ストレートのとき以外は作る必要なし
        if (ref_arrJudgeStgST != undefined) {
            if (funcRtn == PokerHand.STRAIGHT_NORMAL) {
                //数字の強い順に並べる
                wkArrMinST.sortByNumber(); arrCardNum.reverse();
                ref_arrJudgeStgST.copy(wkArrMinST);
            } else if (funcRtn == PokerHand.STRAIGHT_ACE) {
            //エースストレートの場合は設定値固定
                ref_arrJudgeStgST.copy([14, 13, 12, 11, 10]);
            }
        }

        return funcRtn;
    }

    //**********************************
    //フルハウス系判定
    //arg_hand：手札(Card配列)
    //ref_arrValidCardNum：有効数字配列
    //ref_arrJudgeStg：判定用カード強さ配列
    //**********************************
    PokerHand.chkFullHouseETC = function (arg_hand, ref_arrValidCardNum, ref_arrJudgeStg) {
        var hand = arg_hand;
        var funcRtn = PokerHand.NOPKHAND;  //戻り値用
        var arrValidCardNum = new Array(); //有効数字配列(非重複)
        var arrCardStg = new Array();      //カード強さ配列
        var intNumPairCnt = 0;             //同位札ペアカウンタ

        //カード強さ配列作成
        for (var i = 0; i < hand.length; i++) arrCardStg.push(hand[i].stg);
        //カード強さ配列を要素数、強さ順にソート
        arrCardStg.sortByCntElmNum();

        //Jokerがあった場合、Jokerの数字を要素数、強さの順で最も大きい数字に置き換える
        if ((idx = arrCardStg.indexOf(Card.JK.STG)) != -1) {
            var arrTmp = new Array(); //Jokerを除いた強さ配列
            arrTmp.copy(arrCardStg); arrTmp.splice(idx, 1);
            //Jokerを置換
            arrCardStg.splice(idx, 1, arrTmp[0]);
        }

        //同位札ペアカウント
        for (var i = 0; i < arrCardStg.length - 1; i++)
            for (var j = i + 1; j < arrCardStg.length; j++)
                if (arrCardStg[i] == arrCardStg[j]) {
                    intNumPairCnt++; //同位札ペアカウントアップ
                    if (!arrValidCardNum.contains((arrCardStg[i] == 14) ? 1 : arrCardStg[i]))
                        arrValidCardNum.push((arrCardStg[i] == 14) ? 1 : arrCardStg[i]); //有効数字配列要素追加
                }

        //判定処理(Joker置換後が前提)
        switch (intNumPairCnt) {
            case 1: funcRtn = PokerHand.ONEPAIR; break;    //ワンペア
            case 2: funcRtn = PokerHand.TWOPAIR; break;    //ツーペア
            case 3: funcRtn = PokerHand.THREECARD; break;  //スリーカード
            case 4: funcRtn = PokerHand.FULLHOUSE; break;  //フルハウス
            case 6: funcRtn = PokerHand.FOURCARD; break;   //フォーカード
            case 10: funcRtn = PokerHand.FIVECARD; break;  //ファイブカード
            default: funcRtn = PokerHand.NOPKHAND; break;  //その他は役なし判定
        }

        //有効数字配列設定
        if (ref_arrValidCardNum != undefined) {
            if (arrValidCardNum.length >= 1) ref_arrValidCardNum.copy(arrValidCardNum);
            //候補なしの場合は、要素数、強さの順で最も大きい(Joker以外の)数字とする
            else ref_arrValidCardNum.copy((arrCardStg[0] == 14) ? [1] : [arrCardStg[0]]); 
        }

        //判定用カード強さ配列設定(Joker置換後が前提)
        if (ref_arrJudgeStg != undefined) {
            if (idx != -1) arrCardStg.sortByCntElmNum(); //Jokerがあった場合はソート
            ref_arrJudgeStg.copy(arrCardStg);
        }

        return funcRtn
    }
}

//**********************************
//コンストラクタ
//arg_hand：手札
//**********************************
PokerHand.prototype.initialize = function (arg_hand) {
    if (arg_hand == undefined) return;
    //対象手札
    this.hand = new Array(); this.hand.copy(arg_hand);
    //有効スート
    this.arrValidSuit = new Array();
    //有効数字配列(ストレート用)
    this.arrValidCardNumST = new Array();
    //有効数字配列(フルハウス系用)
    this.arrValidCardNumFH = new Array();
    //判定用カード強さ配列(同じ役同士で強さを判定するときに使用)
    this.arrJudgeStg = new Array();
    //ポーカーハンド情報(クラス変数で定義されたものを保持)
    this.PKHand = PokerHand.chkPKFunc(arg_hand, this.arrValidSuit, this.arrValidCardNumST,
                                      this.arrValidCardNumFH, this.arrJudgeStg);
    //ポーカーハンド情報(文字列)
    this.PKHandStr = PokerHand.getPKHandByStr(this.PKHand);
    //Joker保持フラグ
    this.hasJoker = arg_hand.containsByCardIdx(Card.JK.IDX);
}