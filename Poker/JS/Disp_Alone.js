//画面の表示を行うクラス
//htmlタグ関連の処理もここに記述

//画面情報保持変数
var g_dispInfo = {
    chkCardArr: new Array(),
    chkUseJoker: false,
    btnExchgStr: ""
};

//**********************************
//画面表示クラス
//**********************************
function Disp() {
    //Exchgボタンのvalue用文字列
    var ENUM_EXCHG = {
        exchgBef: "交換して勝負",
        exchgAft: "次のゲーム"
    };

    //ポーカーハンドカウンタ用変数
    var dispPKHandCntInfo = {
        SUM: 0,
        ROYAL_STRAIGHT_FLUSH: 0,
        FIVECARD: 0,
        STRAIGHT_FLUSH: 0,
        FOURCARD: 0,
        FULLHOUSE: 0,
        FLUSH: 0,
        STRAIGHT: 0,
        THREECARD: 0,
        TWOPAIR: 0,
        ONEPAIR: 0,
        HIGHCARD: 0
    };

    //**********************************
    //画面情報格納
    //**********************************
    Disp.setDispInfo = function () {
        g_dispInfo.chkCardArr = Disp.getChkCardArr();
        g_dispInfo.chkUseJoker = document.getElementById("chkUseJoker").checked;
        g_dispInfo.btnExchgStr = document.getElementById("btnExchg").value;
    }

    //**********************************
    //STATE別画面表示
    //**********************************
    Disp.showDispByState = function (arg_state, arg_isBefore) {
        var state = arg_state;
        var isBef = arg_isBefore;
        var btnExchg = document.getElementById("btnExchg");
        var chkUseJoker = document.getElementById("chkUseJoker");

        switch (state) {
            //初期、ポーカーハンドジャッジ後              
            case EN_STATE.INI:
            case EN_STATE.PKHAND_JUDGE:
                if (isBef) { }
                else {
                    Disp.showPKHandStr("");                 //ポーカーハンドクリア
                    btnExchg.disabled = false;            //交換ボタン使用可
                    btnExchg.value = ENUM_EXCHG.exchgBef; //交換ボタンValue変更
                    chkUseJoker.disabled = true;          //Joker使用ﾁｪｯｸﾎﾞｯｸｽ使用不可
                    Disp.enableChkCard(true);             //交換カードﾁｪｯｸﾎﾞｯｸｽ使用可
                    Disp.clearChkCard();                  //交換カードﾁｪｯｸﾎﾞｯｸｽチェッククリア
                }
                break;

            //交換カード選択時
            case EN_STATE.CARD_SELECT:
                if (isBef) { }
                else {
                    btnExchg.disabled = false;            //交換ボタン使用可
                    btnExchg.value = ENUM_EXCHG.exchgAft; //交換ボタンValue変更
                    chkUseJoker.disabled = false;         //Joker使用ﾁｪｯｸﾎﾞｯｸｽ使用可
                    Disp.enableChkCard(false);            //交換カードﾁｪｯｸﾎﾞｯｸｽ使用不可
                }
                break;

            case EN_STATE.BERSERKER:
                if (isBef) {
                    Disp.clearChkCard();                  //交換カードﾁｪｯｸﾎﾞｯｸｽチェッククリア
                    Disp.enableChkCard(false);            //交換カードﾁｪｯｸﾎﾞｯｸｽ使用不可
                    btnExchg.disabled = true;             //交換ボタン使用不可
                    chkUseJoker.disabled = true;          //Joker使用ﾁｪｯｸﾎﾞｯｸｽ使用不可
                }
                else { }
                break;
        }
    }

    //**********************************
    //チェックボックス情報をbln配列で返す
    //**********************************
    Disp.getChkCardArr = function () {
        var chkCardArr = new Array();
        for (var i = 0; i < 5; i++) {
            var elm = document.getElementById("chkCard" + i);
            chkCardArr.push(elm.checked);
        }
        return chkCardArr;
    }

    //**********************************
    //交換ボタンの文字列変更
    //**********************************
    Disp.changeBtnExchg = function (arg_str) {
        if (!arg_str) return G_ERROR;
        var elm = document.getElementById("btnExchg");
        elm.value = arg_str;
    }

    //**********************************
    //チェックボックスの使用可否設定
    //**********************************
    Disp.enableChkCard = function (arg_canUse) {
        if (arg_canUse == undefined) return G_ERROR;
        for (var i = 0; i < 5; i++) {
            var elm = document.getElementById("chkCard" + i);
            elm.disabled = !arg_canUse;
        }
    }

    //**********************************
    //チェックボックスのチェッククリア
    //**********************************
    Disp.clearChkCard = function () {
        for (var i = 0; i < 5; i++) {
            var elm = document.getElementById("chkCard" + i);
            elm.checked = false;
        }
    }

    //**********************************
    //手札を表or裏にしていく
    //arg_hand：手札を表すCard配列
    //arg_toFace：true=表、false=裏にしていく
    //arg_isAll：手札全てにフェードイン・アウトを行う
    //**********************************
    Disp.toPublicGrad = function (arg_hand, arg_playerid, arg_toFace, arg_isAll, arg_useSE) {
        var hand = arg_hand;
        var playerid = arg_playerid || "";
        var toFace = (arg_toFace != undefined) ? arg_toFace : true;
        var isAll = (arg_isAll != undefined) ? arg_isAll : false;
        var useSE = (arg_useSE != undefined) ? (G_USE_SE && arg_useSE) : (G_USE_SE);
        var wkDrawFlg = false;
        for (var i = 0; i < hand.length; i++) {
            if (isAll || hand[i].isFace != toFace) {
                wkDrawFlg = true;
                hand[i].setFace(toFace);
                if (G_BROWZER == "ie9" || G_BROWZER == "ie10") {
                    $("#imgCard" + playerid + i).fadeOut(G_TOFACE_TIME + i * G_TOFACE_LAG,
                                          Disp.changeCardImg.bind(this, "imgCard" + playerid + i, hand[i].imgStr));
                    $("#imgCard" + playerid + i).fadeIn(G_TOFACE_TIME);

                } else {
                    $("#imgCard" + playerid + i).fadeOut(G_TOFACE_TIME + i * G_TOFACE_LAG,
                                         (function () { Disp.changeCardImg("imgCard" + playerid + i, hand[i].imgStr) })());
                    $("#imgCard" + playerid + i).fadeIn(G_TOFACE_TIME);
                }
            }
        }
        if (wkDrawFlg && useSE) playSE(G_EN_SE.DRAW);
        return true; //処理終了
    }

    //**********************************
    //カードの画像を変える(１枚)
    //**********************************
    Disp.changeCardImg = function (arg_id, arg_imgStr) {
        var id = arg_id;
        var imgStr = arg_imgStr;
        var elm = document.getElementById(id);
        elm.src = G_IMG_DIR + imgStr + G_IMG_EXT;
        elm.width = G_CARD_WIDTH; //画像サイズ調整
    }

    //**********************************
    //手札を画面に反映
    //**********************************
    Disp.applyHand = function (arg_hand) {
        for (var i = 0; i < arg_hand.length; i++)
            Disp.changeCardImg("imgCard" + i, arg_hand[i].imgStr);
    }

    //**********************************
    //ポーカーハンドカウント表示
    //**********************************
    Disp.showPKHandCnt = function (arg_PKHand, arg_num, arg_isAdd) {
        var PKHand = arg_PKHand;
        var num = arg_num || 0;
        var isAdd = arg_isAdd || true;
        
        //加算する場合
        if (isAdd) {
            //ポーカーハンドカウント変数処理、画面反映
            document.getElementById("PKHandCntSum").innerHTML = ++dispPKHandCntInfo.SUM; //合計数
            if (PKHand == PokerHand.ROYAL_STRAIGHT_FLUSH)   document.getElementById("PKHandCnt" + 10).innerHTML = ++dispPKHandCntInfo.ROYAL_STRAIGHT_FLUSH;
            else if (PKHand == PokerHand.FIVECARD)          document.getElementById("PKHandCnt" + 9).innerHTML = ++dispPKHandCntInfo.FIVECARD;
            else if (PKHand == PokerHand.STRAIGHT_FLUSH)    document.getElementById("PKHandCnt" + 8).innerHTML = ++dispPKHandCntInfo.STRAIGHT_FLUSH;
            else if (PKHand == PokerHand.FOURCARD)          document.getElementById("PKHandCnt" + 7).innerHTML = ++dispPKHandCntInfo.FOURCARD;
            else if (PKHand == PokerHand.FULLHOUSE)         document.getElementById("PKHandCnt" + 6).innerHTML = ++dispPKHandCntInfo.FULLHOUSE;
            else if (PKHand == PokerHand.FLUSH)             document.getElementById("PKHandCnt" + 5).innerHTML = ++dispPKHandCntInfo.FLUSH;
            else if (PKHand == PokerHand.STRAIGHT)          document.getElementById("PKHandCnt" + 4).innerHTML = ++dispPKHandCntInfo.STRAIGHT;
            else if (PKHand == PokerHand.THREECARD)         document.getElementById("PKHandCnt" + 3).innerHTML = ++dispPKHandCntInfo.THREECARD;
            else if (PKHand == PokerHand.TWOPAIR)           document.getElementById("PKHandCnt" + 2).innerHTML = ++dispPKHandCntInfo.TWOPAIR;
            else if (PKHand == PokerHand.ONEPAIR)           document.getElementById("PKHandCnt" + 1).innerHTML = ++dispPKHandCntInfo.ONEPAIR;
            else if (PKHand == PokerHand.HIGHCARD)          document.getElementById("PKHandCnt" + 0).innerHTML = ++dispPKHandCntInfo.HIGHCARD;
        } else { //指定された値に変更する場合
            if (PKHand == PokerHand.ROYAL_STRAIGHT_FLUSH)   document.getElementById("PKHandCnt" + 10).innerHTML = num;
            else if (PKHand == PokerHand.FIVECARD)          document.getElementById("PKHandCnt" + 9).innerHTML = num;
            else if (PKHand == PokerHand.STRAIGHT_FLUSH)    document.getElementById("PKHandCnt" + 8).innerHTML = num;
            else if (PKHand == PokerHand.FOURCARD)          document.getElementById("PKHandCnt" + 7).innerHTML = num;
            else if (PKHand == PokerHand.FULLHOUSE)         document.getElementById("PKHandCnt" + 6).innerHTML = num;
            else if (PKHand == PokerHand.FLUSH)             document.getElementById("PKHandCnt" + 5).innerHTML = num;
            else if (PKHand == PokerHand.STRAIGHT)          document.getElementById("PKHandCnt" + 4).innerHTML = num;
            else if (PKHand == PokerHand.THREECARD)         document.getElementById("PKHandCnt" + 3).innerHTML = num;
            else if (PKHand == PokerHand.TWOPAIR)           document.getElementById("PKHandCnt" + 2).innerHTML = num;
            else if (PKHand == PokerHand.ONEPAIR)           document.getElementById("PKHandCnt" + 1).innerHTML = num;
            else if (PKHand == PokerHand.HIGHCARD)          document.getElementById("PKHandCnt" + 0).innerHTML = num;
        }
    }

    //**********************************
    //出現率を画面に表示
    //**********************************
    Disp.showPKHandProb = function () {        
        //合計数が0のとき
        if (dispPKHandCntInfo.SUM == 0) {
            for (var i = 0; i <= 10; i++)
                elmPKHandProb[i].innerHTML = "-";
        } else { //合計数が0以外のときは出現確率を表示
            document.getElementById("PKHandProb" + 10).innerHTML = myRound((dispPKHandCntInfo.ROYAL_STRAIGHT_FLUSH / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 9).innerHTML = myRound((dispPKHandCntInfo.FIVECARD / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 8).innerHTML = myRound((dispPKHandCntInfo.STRAIGHT_FLUSH / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 7).innerHTML = myRound((dispPKHandCntInfo.FOURCARD / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 6).innerHTML = myRound((dispPKHandCntInfo.FULLHOUSE / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 5).innerHTML = myRound((dispPKHandCntInfo.FLUSH / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 4).innerHTML = myRound((dispPKHandCntInfo.STRAIGHT / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 3).innerHTML = myRound((dispPKHandCntInfo.THREECARD / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 2).innerHTML = myRound((dispPKHandCntInfo.TWOPAIR / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 1).innerHTML = myRound((dispPKHandCntInfo.ONEPAIR / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
            document.getElementById("PKHandProb" + 0).innerHTML = myRound((dispPKHandCntInfo.HIGHCARD / dispPKHandCntInfo.SUM) * 100, G_CNT_KETA) + "％";
        }
    }

    //**********************************
    //ポーカーハンドを画面に表示
    //**********************************
    Disp.showPKHandStr = function (arg_PKHand) {
        var elm = document.getElementById("PKHandStr");
        if (arg_PKHand == undefined) { elm.innerHTML = ""; return; }
        if (typeof arg_PKHand == "string") { elm.innerHTML = arg_PKHand; return; }

        elm.innerHTML = arg_PKHand.PKHandStr;
        if (arg_PKHand.PKHand <= PokerHand.THREECARD) { elm.style.color = "black"; }
        else if (arg_PKHand.PKHand <= PokerHand.FULLHOUSE) { elm.style.color = "red"; }
        else { Disp.gradStr(elm.id, arg_PKHand.PKHandStr); }
    }

    //**********************************
    //文字列をレインボーグラデーション表示
    //**********************************
    var g_colorSrtIdx = 0; //文字列カラー表現用変数
    Disp.gradStr = function (arg_id, arg_str, arg_isFromLeftToRight) {
        var isFromLeftToRight = (arg_isFromLeftToRight != undefined) ? arg_isFromLeftToRight : true;
        clearTimeout(g_gradStrTimer);
        g_gradStrTimer = setTimeout(function () { Disp.gradStr(arg_id, arg_str, isFromLeftToRight) }, G_GRAD_SPD);
        var COLOR = ["#ff0000", "#ff8000", "#ffff00", "#80ff00", "#00ff00", "#00ff80",
                     "#00ffff", "#0080ff", "#0000ff", "#8000ff", "#ff00ff", "#ff0080"];
        var elm = document.getElementById(arg_id);
        var colorIdx = g_colorSrtIdx;
        var str = "";
        //フォントの異なる文字を文字列に追加していく
        for (i = 0; i < arg_str.length; i++) {
            colorIdx = colorIdx % COLOR.length;
            str += arg_str.charAt(i).fontcolor(COLOR[colorIdx++]);
        }
        //次回Timer呼び出し時のCOLOR配列スタートインデックス設定
        if (isFromLeftToRight) {
            g_colorSrtIdx = (--g_colorSrtIdx < 0) ? g_colorSrtIdx + COLOR.length : g_colorSrtIdx;
        } else {
            g_colorSrtIdx = ++g_colorSrtIdx % COLOR.length;
        }
        elm.innerHTML = str;
    }

    //**********************************
    //ポーカーハンドカウントクリア
    //**********************************
    Disp.clearPKHandCnt = function () {
        //ポーカーハンドカウンタ用変数初期化
        for (var i in dispPKHandCntInfo) dispPKHandCntInfo[i] = 0;
        //ポーカーハンドカウント表示クリア
        for (var i = 0; i <= 10; i++) document.getElementById("PKHandCnt" + i).innerHTML = "0";
        document.getElementById("PKHandCntSum").innerHTML = "0"
        //出現率表示クリア
        for (var i = 0; i <= 10; i++) document.getElementById("PKHandProb" + i).innerHTML = "-";
    }

    //**********************************
    //ポーカーハンド別にSEを出す
    //**********************************
    Disp.playSEByPKHand = function (arg_PKHand) {
        var seNum = G_EN_SE.NONE;
        if (arg_PKHand.PKHand <= PokerHand.THREECARD) { }
        else if (arg_PKHand.PKHand <= PokerHand.FULLHOUSE) { seNum = G_EN_SE.WIN_LV2; }
        else { seNum = G_EN_SE.WIN_LV3; }
        playSE(seNum);
    }
}


//▼▼▼htmlタグ関連▼▼▼
//**********************************
//SE処理
//**********************************
var soundRenban = 0;
function playSE(arg_SENum, arg_useSE) {
    var SENum = arg_SENum;
    var useSE = (arg_useSE != undefined) ? (arg_useSE && G_USE_SE) : (G_USE_SE);
    if (!useSE) return 0;     //SE使用フラグがfalseのときは何もしない
    if (SENum == 0) return 0; //引数が0のときは何もしない
    //SE番号が-1のときはSEを止める
    if (SENum == -1) {
        for (var i = 0; i < 5; i++) document.getElementById("sound" + i).innerHTML = '<embed />';
        return 0;
    }
    //SEを鳴らす
    //連番設定
    soundRenban -= 0; soundRenban = ++soundRenban % 5; soundRenban += "";
    var elmSound = document.getElementById("sound" + soundRenban);
    var strSEName = "";
    strSEName += G_SOUND_DIR;        //フォルダ
    strSEName += G_SE_PREF;          //接頭辞
    strSEName += SENum;              //連番
    strSEName += G_SOUND_EXT;        //拡張子
    var option = '"';
    option += ' autostart = "true"'; // 自動再生
    option += ' loop = "false"';     // ループ再生
    elmSound.innerHTML = '<embed src="' + strSEName + option + ' />';
}
//**********************************
//BGM処理
//**********************************
function playBGM(arg_BGMNum, arg_useBGM) {
    var BGMNum = arg_BGMNum;
    var useBGM = (arg_useBGM != undefined) ? (arg_useBGM && G_USE_BGM) : G_USE_BGM;
    var elmBgm = document.getElementById("bgm");
    if (!useBGM) return 0;            //BGM使用フラグがfalseのときは何もしない       
    if (BGMNum == 0) return 0;        //引数が0のときは何もしない       
    if (BGMNum == g_bgmNum) return 0; //同じBGM番号を指定されたときは何もしない
    if (BGMNum == -1)                 //BGM番号が-1のときはBGMを止める
    { elmBgm.innerHTML = "<embed  />"; return 0; }

    g_bgmNum = BGMNum;                //グローバル変数設定
    //BGMをかける
    var strBgmName = "";
    strBgmName += G_SOUND_DIR;        //フォルダ
    strBgmName += G_BGM_PREF;         //接頭辞
    strBgmName += BGMNum;             //連番
    strBgmName += G_SOUND_EXT;        //拡張子
    var option = '"';
    option += ' autostart = "true"';  //自動再生
    option += ' loop = "true"';       //ループ再生
    elmBgm.innerHTML = '<embed src="' + strBgmName + option + ' />';
}