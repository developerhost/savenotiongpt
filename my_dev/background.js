// ブラウザのローカルストレージからAPIキーを取得する
async function getApiKey() {
  let gettingItem = browser.storage.local.get('notion_api_key');
  console.log("gettingItem",gettingItem);
  let notion_api_key = await gettingItem.then((res) => res.notion_api_key);
  console.log("notion_api_key",notion_api_key);
  return notion_api_key;
 }
 
 // 指定された送信者にデータベースのリストを返す役割を持ちます。
 async function list_databases(sender) {
  // getApiKey関数を使ってNotion APIキーを取得します
  let notion_api_key = await getApiKey();
  
  // Notion APIを使ってデータベースのリストを取得します
  let dataResponse = await fetch('https://api.notion.com/v1/databases',{
   headers: {
    'Authorization': 'Bearer '+notion_api_key,
    'Notion-Version': '2021-05-13'
   },
   referrerPolicy: "no-referrer-when-downgrade",
   mode: "same-origin",
  }).then(response => response.json());
  
  console.log("data",dataResponse);
  
  // browser.tabs.sendMessage関数を使用して、送信者のタブIDにメッセージを送信します
  await browser.tabs.sendMessage(sender.tab.id,{
   type: 'stn_list_databases',
   data: dataResponse,
  })
  console.log("OK !");
 }
 
 // browser.runtime.onMessage.addListener関数を使用して、メッセージの受信を待ち受ける役割を持ちます。
 browser.runtime.onMessage.addListener((data, sender) => {
  if (data.type === 'stn_list_databases') {
   return list_databases(sender)
  }
  return false;
 });
 
 // データと送信者をデータベースに保存するための非同期関数です。
 async function save_to_databases(data,sender) {
  console.log("data",data,sender);

  // getApiKey()関数を使ってNotion APIキーを取得します。
  let notion_api_key = await getApiKey();
  
  // 指定されたURLにPOSTリクエストを送信します。リクエストヘッダーには、Notion APIキーとバージョン情報が含まれます
  for (id of data.ids) {
   let dataResponse = await fetch('https://api.notion.com/v1/pages',{
    method: 'POST',
    headers: {
     'Authorization': 'Bearer '+notion_api_key,
     'Notion-Version': '2021-05-13',
     'Content-Type': 'application/json'
    },
    referrerPolicy: "no-referrer-when-downgrade",
    mode: "same-origin",
    body: JSON.stringify({
     parent: {
      database_id: id,
     },
     properties: {
      // ここのプロパティに必要な情報を追加していく
      Name: {
       title: [
        {
         text: {
          content:data.data.title,
         }
        }
       ]
      },
      Url: {
       url: data.data.url
      }
     }
    })
   }).then(response => response.json());
  
   console.log(dataResponse);
  }
 }
 
 // ブラウザのランタイムでメッセージを受け取るためのリスナーを設定しています。
 // メッセージが受信されると、与えられたデータと送信者の情報を引数として受け取ります
 browser.runtime.onMessage.addListener((data, sender) => {
  if (data.type === 'stn_save_to_databases') {
   return save_to_databases(data,sender)
  }
  return false;
 });