//プログラム全体で使用

//**********************************
//IE用Array.indexOf
//**********************************
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) return i;
        }
        return -1;
    }
}

//**********************************
//ブラウザ名を取得
//ソース:javaScriptで対応ブラウザ判定
//URL:http://qiita.com/Evolutor_web/items/162bfcf83695c83f1077
//**********************************
function getBrowser() {
    var ua = window.navigator.userAgent.toLowerCase();
    var ver = window.navigator.appVersion.toLowerCase();
    var name = 'unknown';

    if (ua.indexOf("msie") != -1) {
        if (ver.indexOf("msie 6.") != -1) {
            name = 'ie6';
        } else if (ver.indexOf("msie 7.") != -1) {
            name = 'ie7';
        } else if (ver.indexOf("msie 8.") != -1) {
            name = 'ie8';
        } else if (ver.indexOf("msie 9.") != -1) {
            name = 'ie9';
        } else if (ver.indexOf("msie 10.") != -1) {
            name = 'ie10';
        } else {
            name = 'ie';
        }
    } else if (ua.indexOf('trident/7') != -1) {
        name = 'ie11';
    } else if (ua.indexOf('chrome') != -1) {
        name = 'chrome';
    } else if (ua.indexOf('safari') != -1) {
        name = 'safari';
    } else if (ua.indexOf('opera') != -1) {
        name = 'opera';
    } else if (ua.indexOf('firefox') != -1) {
        name = 'firefox';
    }
    return name;
};

//**********************************
//アニメーション処理
//arg_anime：アニメーションオブジェクト
// .anime=処理、.interval=事前の処理との時間間隔
//arg_arrTimer：timer配列
//**********************************
function animate(arg_anime, arg_arrTimer) {
    if (arg_arrTimer == undefined) alert("animate:arrTimer未設定エラー");
    var arrAnime = arg_anime || [];
    var intervalSum = 0;
    for (var i = 0; i < arrAnime.length; i++) {
        intervalSum += arrAnime[i].interval;
        arg_arrTimer.push(setTimeout(arrAnime[i].anime, intervalSum));
    }
}

//**********************************
//アニメーション中断
//arg_arrTimer：timer配列
//**********************************
function stopAnimate(arg_arrTimer) {
    if (!arg_arrTimer) return;
    if (!(arg_arrTimer instanceof Array)) {
        clearTimeout(arg_arrTimer);
    } else {
        for (var i = 0; i < arg_arrTimer.length; i++)
            clearTimeout(arg_arrTimer[i]);
    }
    arg_arrTimer = new Array(); //timer配列初期化
}

//**********************************
//Objectにbitが含まれているかを返す
//負数は対象外
//**********************************
function containsByBit(obj,bit) {
    if (obj < 0 || bit < 0) return G_ERROR;
    else if ((obj & bit) == bit) return true;
    else return false;
}

//**********************************
//四捨五入
//arg_num:対象の数値
//arg_keta:小数点以下桁数
//**********************************
function myRound(arg_num, arg_keta) {
    var num = arg_num; keta = arg_keta;

    num *= Math.pow(10, keta);
    num = Math.round(num);
    num /= Math.pow(10, keta);

    return num;
}

//**********************************
//配列をコピー(値渡し)
//**********************************
Array.prototype.copy = function (obj) {
    this.splice(0, this.length);
    for (var i = 0; i < obj.length; i++)
        this.push(obj[i]);
}
//**********************************
//配列内に指定要素があるかを返す
//**********************************
Array.prototype.contains = function (obj) {
    for (var i = 0; i < this.length; i++)
        if (this[i] == obj) return true;
    return false
}
//**********************************
//配列内の指定要素の個数を数える
//**********************************
Array.prototype.cntElm = function (elm) {
    var cnt = 0, wkIdx;
    wkIdx = this.indexOf(elm);
    if (wkIdx != -1) cnt++;
    else return 0;
    while (this.indexOf(elm, wkIdx + 1) != -1) {
        wkIdx = this.indexOf(elm, wkIdx + 1);
        cnt++;
    }
    return cnt;
}
//**********************************
//要素の多い順に配列内をソート
//**********************************
Array.prototype.sortByCntElm = function () {
    var arr = new Array(); arr.copy(this);
    this.sort(function (a, b) {
        return (arr.cntElm(a) > arr.cntElm(b)) ? -1 : 1;
    });
}

//**********************************
//要素の多い順、数値の大きい順に配列内をソート
//**********************************
Array.prototype.sortByCntElmNum = function () {
    var arr = new Array(); arr.copy(this);
    this.sort(function (a, b) {
        if (arr.cntElm(a) != arr.cntElm(b))
            return (arr.cntElm(a) > arr.cntElm(b)) ? -1 : 1;
        else
            return (parseInt(a) > parseInt(b)) ? -1 : 1;
    });
}

//**********************************
//数値の小さい順で配列内をソート
//**********************************
Array.prototype.sortByNumber = function () {
    this.sort(function (a, b) {
        return (parseInt(a) > parseInt(b)) ? 1 : -1;
    });
}
//**********************************
//配列内の要素自身を反転(破壊的)
//ex.[true,false,false]->[false,true,true]
//**********************************
Array.prototype.reverseElm = function (obj) {
    for (var i = 0; i < this.length; i++) this[i] = !this[i];
    return this;
}
//**********************************
//引数で指定された要素がある分を配列で返す
//arg_arrHold：残す要素を入れた配列
//**********************************
Array.prototype.holdByArrElm = function (arg_arrHold) {
    if (arg_arrHold == undefined) return;
    var arrHold = new Array(); arrHold.copy(arg_arrHold);
    var arrRtn = new Array(); //戻り値用
    for (var i = 0; i < arrHold.length; i++)
    //arrHoldに値が入っているかをチェック
        if (this.contains(arrHold[i])) arrRtn.push(arrHold[i]);

    return arrRtn;
}