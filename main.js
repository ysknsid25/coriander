const main = async () => {

    const programDataArr = await getAandGProgarmList();
    //const programDataArr = programTestData; //番組表のテストデータ

    if(!programDataArr.length){
        notify('APIから番組データの取得に失敗しました');
        return;
    }

    const interestedPrograms = programDataArr
        .filter((programData) => getKeywordMatchProgram(programData))
        .filter((programData) => getTimeMatchProgram(programData))
        .map((programDate) => getFormatedText(programDate));

    //キーワードに合致する番組があれば送信
    if(interestedPrograms.length){
        notify(interestedPrograms.reduce((text, current) => text + current));
    }

    return;

};

//特定のチャットルームに通知を送信します
const notify = (notifyText) => {

    //チャットルームのURLを指定する
    const WEBHOOK_URL = ''; 
    const message = {'text' : notifyText}
    const options = {
        'method': 'POST',
        'headers' : {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        'payload':JSON.stringify(message)
    };

    UrlFetchApp.fetch(WEBHOOK_URL, options);

};

//スプレッドシートの取得
const getSpreadSheet = (sheetIndex = 0) => {

    //キーワードを記載したスプレッドシートのURLを指定する
    const SP_URL = ''; 
    const spreadsheet = SpreadsheetApp.openByUrl(SP_URL);

    return spreadsheet.getSheets()[sheetIndex];

};

//検索キーワードを配列で取得
const getKeywordArr = () => {

    //とりあえず100行分のキーワードを、空文字を取り除いて取得する
    return getSpreadSheet().getRange(1, 1, 100)
        .getValues()
        .reduce((pre,current) => {pre.push(...current);return pre},[])
        .filter((keyword) => keyword != ''); 

};

//別AppsScriptで取得したJSONデータへアクセスして、番組データを取得します
const getAandGProgarmList = async () => {

    const fileName = getReadFileName();
    console.log('FileName:' + fileName);
    const json = DriveApp.getFolderById(GOOGLE_DRIVE_INFO.FOLDER_ID)
    .getFilesByName(fileName + GOOGLE_DRIVE_INFO.DELETE_FILENAME)
    .next()
    .getBlob()
    .getDataAsString();

    const jsonData = JSON.parse(json);

    return jsonData;

};

//読み取り番組表JSONファイル名を取得する
const getReadFileName = () => {
    const dateObj = new Date();
    const nowHours = dateObj.getHours();

    //午前0~6時までは前日の番組表を見に行く
    if(0 <= nowHours && nowHours < 6){
        dateObj.setDate(dateObj.getDate()-1);
    }

    return dateObj.getFullYear() + '' + complementZero((dateObj.getMonth() + 1)) + '' + complementZero(dateObj.getDate());
};

//番組表データから自分の興味のありそうな番組を検索します
const getKeywordMatchProgram = (programData) => {

    const targetKeywordArr = getKeywordArr();
    //const targetKeywordArr = ["A&G", "割り切れない", "天月", "宮本"]; //テストデータ

    const programTitle = programData.title;
    const programPresonality = programData.personality;

    return targetKeywordArr.some((keyWord) => programTitle.indexOf(keyWord) > -1 || programPresonality.indexOf(keyWord) > -1);

};

//現在時刻の一時間後に始まるプログラムか判定します
const getTimeMatchProgram = (programData) => {

    return programData.beginTime >= getNextHour() && programData.endTime <= getNextHour(2);

};

//現在時刻+1時間をデフォルトで返します。
//基本的には、開始時刻・終了時刻を指定するために使います
const getNextHour = (addHour = 1) => {

    const date = new Date();
    return "" + date.getDate() + complementZero((date.getHours() + addHour)) + "00";

};

//0埋め処理
const complementZero = (hour) => {

    const strHour = "" + hour;
    if(strHour.length == 1){
        return "0" + strHour;
    }
    return strHour;

};


//一時間後に自分の興味ありそうな番組を取得した場合、
//チャットルームに送信するメッセージの形式を整えて通知します。
const getFormatedText = (programData) => {

    const separator = '------------------------------------------';
    const returnCode = '\n';
    const first = programData.isFirst  ? '【初】' : '';
    const realTime = programData.isRealTime ? '【生】' : '';
    const repeat = programData.isRepeat ? '【再】' : '';
    const title = first + realTime + repeat + programData.title;
    const programPresonality = programData.pfm;
    const beginTime = programData.beginTime.substring(0,2) + ":" + programData.beginTime.substring(2);

    return separator + returnCode + title + returnCode + programPresonality + returnCode + beginTime + returnCode + returnCode;

};

//テストデータ
const programTestData = [ { title: '千葉翔也のトゥー・ビー・ナイト',
ft: '202101230000',
to: '202101230057',
pfm: '千葉翔也',
dur: 57,
isBroadcast: true,
isRepeat: false },
{ title: 'ファンキル・タガタメプレゼンツ 今泉Pの絶！つながるラジオ',
ft: '202101230057',
to: '202101230100',
pfm: '今泉潤',
dur: 3,
isBroadcast: true,
isRepeat: false },
{ title: '江口拓也のラジオ道場',
ft: '202101230100',
to: '202101230130',
pfm: '江口拓也',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'IdentityV荘園ラジオ',
ft: '202101230130',
to: '202101230200',
pfm: '保住有哉',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '深町寿成・小松昌平 TWO for ONE',
ft: '202101230200',
to: '202101230230',
pfm: '深町寿成、小松昌平',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '柿原と流田のラジオ＋（    ）',
ft: '202101230230',
to: '202101230300',
pfm: '柿原徹也、流田豊',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '裏方',
ft: '202101230300',
to: '202101230330',
pfm: '松原秀',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'あさステ！',
ft: '202101230800',
to: '202101230900',
pfm: '週替わりパーソナリティ',
dur: 60,
isBroadcast: true,
isRepeat: false },
{ title: '丹下桜のRadio・A・La・Mode',
ft: '202101231200',
to: '202101231230',
pfm: '丹下桜',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'アフィリア魔法学院放送部',
ft: '202101231230',
to: '202101231300',
pfm: 'アンナ ベール',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '白黒瞳ちゃん',
ft: '202101231400',
to: '202101231430',
pfm: '白石晴香、黒木ほの香、関根瞳',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'サンセルモ presents 結婚式は あいのなかで',
ft: '202101231430',
to: '202101231500',
pfm: '野中藍、ゲスト声優',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '鈴木みのりと笑顔満タンで！',
ft: '202101231500',
to: '202101231530',
pfm: '鈴木みのり',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'オトメフラグ＠遊星高校',
ft: '202101231530',
to: '202101231600',
pfm: '天月　山本和臣',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '22/7(ナナブンノニジュウニ) 割り切れないラジオ＋',
ft: '202101231600',
to: '202101231630',
pfm: '22/7(ナナブンノニジュウニ)',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'ふりすた',
ft: '202101231700',
to: '202101231730',
pfm: '早見沙織',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'ひとかな',
ft: '202101231730',
to: '202101231800',
pfm: '花澤香菜',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '二時間番組',
ft: '202101231700',
to: '202101231900',
pfm: '花澤香菜',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: '宮本侑芽のぽじ×ぽじ',
ft: '202101231800',
to: '202101231830',
pfm: '宮本侑芽',
dur: 30,
isBroadcast: true,
isRepeat: false },
{ title: 'A&Gリクエストアワー 阿澄佳奈のキミまち！',
ft: '202101231900',
to: '202101232100',
pfm: '阿澄佳奈／青木佑磨・浅川梨奈（隔週交代）ほか',
dur: 120,
isBroadcast: true,
isRepeat: false },
{ title: 'A&G TRIBAL RADIOエジソン',
ft: '202101232100',
to: '202101232300',
pfm: '江口拓也　髙橋ミナミ',
dur: 120,
isBroadcast: true,
isRepeat: false },
{ title: 'A&Gメディアステーション こむちゃっとカウントダウン',
ft: '202101232300',
to: '202101240000',
pfm: '櫻井孝宏、白石晴香',
dur: 60,
isBroadcast: true,
isRepeat: false } ];