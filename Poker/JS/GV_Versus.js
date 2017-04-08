//グローバル定数

//プレイヤー識別子
var G_PLAYER_ID = {
    PLAYER: "P",
    DEALER: "D"
};

//システム関係
var G_USE_BGM = true;         //BGM使用フラグ
var G_USE_SE = true;          //SE使用フラグ
var G_IMG_DIR = "./img/";     //画像フォルダ
var G_IMG_EXT = ".gif";       //画像の拡張子
var G_SOUND_DIR = "./sound/"; //サウンドフォルダ
var G_SOUND_EXT = ".mp3";     //サウンドの拡張子
var G_BGM_PREF = "bgm_";      //BGMファイルの接頭辞
var G_SE_PREF = "se_";        //SEファイルの接頭辞
var G_BROWZER;                //ブラウザ情報

//画面関係
var G_CARD_WIDTH = 100; //カードの画像サイズ(width指定)

//エフェクト関係
var G_TOFACE_TIME = 20; //カードを表向きにする速さ
var G_TOFACE_LAG = 20;  //カードを表向きにするタイムラグ
var G_GRAD_SPD = 100;   //文字列グラデーション速度

//サウンド関係
//BGMのENUM
var G_EN_BGM = {
    STOP: -1,
    NONE: 0,
    INI: 1
};
//SEのENUM
var G_EN_SE = {
    STOP: -1,
    NONE: 0,
    CARD_SEL: 1,
    SHUFFLE: 2,
    DRAW: 3,
    PLACE: 4,
    WIN: 5,
    LOSE: 6,
    WIN_LV2: 7,
    WIN_LV3: 8
};

//コーディング関係
var G_ERROR = "エラー"; //何らかのエラー発生時に戻り値として使用