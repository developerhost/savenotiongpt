document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      document.getElementById('title').value = tab.title;
      document.getElementById('url').value = tab.url;
  });

  document.getElementById('save_to_notion').addEventListener('click', function() {
      const title = document.getElementById('title').value;
      const url = document.getElementById('url').value;
      const apiKey = document.getElementById('notion_key').value;

      // Notion APIへのリクエストを行う関数を呼び出すなど、保存の実装をこちらに書く
  });
});
