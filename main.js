const main = async () => {

  const url = '';

  //今日のプログラムを取得する
  const programData = await getAandGProgarmList();
  console.log(programData);

  //取得したプログラムのデータをくるくる回して、自分が登録したキーワードに合致するものがあるかを調べる

  //マッチしたやつだけを抽出して、形式を整えていく

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
  UrlFetchApp.fetch(url, options);
}

const getAandGProgarmList = async () => {

  const url = 'https://agqr.sun-yryr.com/api/today'; // リクエスト先URL

  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);

  //値が取得できなかった場合のエラーメッセージを切ってやらんといかん

  return jsonData;

};

