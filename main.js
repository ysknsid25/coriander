const main = async () => {

    const url = 'https://chat.googleapis.com/v1/spaces/AAAAEoh2Zo4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=wg3sihwfsxV5dFa1oVnQvdfEtKkJX9FkEQSGsRTCefk%3D';

    //今日のプログラムを取得する
//    const programData = await getAandGProgarmList();
    const programDataArr = programTestData;

    //取得したプログラムのデータをくるくる回して、自分が登録したキーワードに合致するものがあるかを調べる
    const interestedPrograms = programDataArr.filter((programData) => getKeywordMatchProgram(programData)).filter((programData) => getTimeMatchProgram(programData));

    //キーワードに合致しつつ、現在時間の一時間後に始まる番組を抽出する

    //マッチしたやつだけを抽出して、形式を整えていく
    console.log(interestedPrograms);

    //あとはセットして、送信
    const TEXT = '送信したい文字列';

    // 送信内容を生成
    const message = {'text' : TEXT}
    const options = {
        'method': 'POST',
        'headers' : {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        'payload':JSON.stringify(message)
    };

    // 送信を実行
    //UrlFetchApp.fetch(url, options);
};

const getAandGProgarmList = async () => {

    const url = 'https://agqr.sun-yryr.com/api/today'; // リクエスト先URL

    var json = UrlFetchApp.fetch(url).getContentText();
    var jsonData = JSON.parse(json);

    //値が取得できなかった場合のエラーメッセージを切ってやらんといかん

    return jsonData;

};

const getKeywordMatchProgram = (programData) => {

    //テスト探索対象: 番組キーワード
    const targetKeywordArr = ["A&G", "7/22", "天月", "鈴木"];

    const programTitle = programData.title;
    const programPresonality = programData.pfm;

    return targetKeywordArr.some((keyWord) => programTitle.indexOf(keyWord) > -1 || programPresonality.indexOf(keyWord) > -1);

};

const getTimeMatchProgram = (programData) => {
    return programData.ft.substring(6) >= getNextHour() && programData.to.substring(6) <= getNextHour(2);
};

const getNextHour = (addHour = 1) => {
    const date = new Date();
    return "" + date.getDate() + (date.getHours() + addHour) + "00";
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