//最初に読み込まれたとき
//ページタイトルとURLとfaviconを設定する
window.onload = function () {
  chrome.tabs.getSelected(null, function (tab) {
    document.getElementById("title").innerHTML = tab.title;
    document.getElementById("url").innerHTML = tab.url;
    var icon_url =
      "https://www.google.com/s2/favicons?domain=" + tab.url.split("/")[2];
    document.getElementById("img").setAttribute("src", icon_url);
  });
};

//新しいタブを開くボタン
document.getElementById("open-button").addEventListener("click", function () {
  chrome.tabs.create({ url: "../html/index.html" }, (tab) => {});
});

//保存するボタン
document.getElementById("save-button").addEventListener("click", function () {
  //新しいデータ
  var new_data = {
    url: document.getElementById("url").innerText,
    title: document.getElementById("title").innerText,
    content: document.getElementById("content").value,
  };

  //保存したデータを取り出す
  chrome.storage.local.get("default", function (value) {
    var json_string = "[]";
    if (value.default != undefined) {
      console.log("保存データを取り出しました");
      json_string = value.default;
    }
    //データの追加
    var data = JSON.parse(json_string);
    data.unshift(new_data);
    json_string = JSON.stringify(data);
    console.log(json_string);
    //データの保存
    chrome.storage.local.set({ default: json_string });
  });

  ////データの追加
  //var data = JSON.parse(json_string);
  //data.unshift(new_data);
  //json_string = JSON.stringify(data);
  //console.log(json_string);

  //保存
  //chrome.storage.local.set({ default: json_string });
});
