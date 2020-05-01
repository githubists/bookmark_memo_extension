//各ブックマークのサイトのテンプレート
const site_template =
  '<li class="bookmark-li"> <a class="bookmark-title"> <img class="page-img" width="30" height="30" /> <h3 class="page-name">タイトル</h3> </a> <p class="bookmark-url"> example.com </p> <textarea class="bookmark-content" rows="5" name="content"></textarea> <button class="save-button"/>save</button> <button class="delete-button">✗</button></li>';

//文字列をHTML要素に変換する関数
function createElementFromHTML(html) {
  const tempEl = document.createElement("div");
  tempEl.innerHTML = html;
  return tempEl.firstElementChild;
}

//各ブックマークのサイトに対応するクラス
class Site {
  //--------------------
  //コンストラクタ
  constructor(id, site_data) {
    this.self_element = createElementFromHTML(site_template);
    this.setParent("bookmark-ul");
    this.setId(id);
    this.setUrl(site_data.url);
    this.setTitle(site_data.title);
    this.setContent(site_data.content);
    this.setEventListener();
  }
  //parentをelementとして定義する
  setParent(parent_id) {
    this.parent_element = document.getElementById(parent_id);
  }
  //idを設定する
  setId(id) {
    this.id = id;
    //自分自身のid
    this.self_element.setAttribute("id", this.id);
  }
  //urlを設定する
  setUrl(url) {
    this.url = url;
    //リンクを貼る
    var a_element = this.self_element.children[0];
    a_element.setAttribute("href", this.url);
    //表示されるurlの更新
    var p_element = this.self_element.children[1];
    p_element.innerText = this.url;
    //アイコンのurlを作成・更新
    var domain = this.url.split("/")[2];
    var img_element = this.self_element.children[0].children[0];
    img_element.setAttribute(
      "src",
      "https://www.google.com/s2/favicons?domain=" + domain
    );
  }
  //titleを設定する
  setTitle(title) {
    this.title = title;
    var title_element = this.self_element.children[0].children[1];
    title_element.innerText = this.title;
  }
  //textareaのcontentを設定する
  setContent(content) {
    this.content = content;
    var textarea_element = this.self_element.children[2];
    textarea_element.value = this.content;
  }
  setEventListener() {
    //saveボタン
    this.self_element.children[3].addEventListener("click", {
      site: this,
      handleEvent: save,
    });
    //deleteボタン
    this.self_element.children[4].addEventListener("click", {
      site: this,
      handleEvent: delete_site,
    });
  }
  //コンストラクタ終わり
  //--------------------

  //html上に追加する
  present() {
    this.parent_element.appendChild(this.self_element);
  }

  //html上から削除する
  detach() {
    this.parent_element.removeChild(this.self_element);
  }

  //HTMLからの変更情報を反映する(content)
  fetchChange() {
    var textarea_element = this.self_element.children[2];
    this.setContent(textarea_element.value);
  }

  //JSONにする
  todict() {
    return {
      url: this.url,
      title: this.title,
      content: this.content,
    };
  }
}

//画面上のsaveボタンのクリック
function save(e) {
  console.log("save");
  console.log("id: " + this.site.id.toString());
  this.site.fetchChange();
  data = [];
  sites.forEach(function (site) {
    data.push(site.todict());
  });
  console.log(JSON.stringify(data));
  //データの保存
  chrome.storage.local.set({ default: JSON.stringify(data) });
}

//

//画面上のdeleteボタンのクリック
function delete_site(e) {
  console.log("delete_site");
  console.log("id: " + this.site.id.toString());
  this.site.detach();
  for (var i = this.site.id + 1; i < sites.length; i++) {
    var site = sites[i];
    site.setId(site.id - 1);
  }
  sites.splice(this.site.id, 1);

  data = [];
  sites.forEach(function (site) {
    data.push(site.todict());
  });
  console.log(JSON.stringify(data));
  //データの保存
  chrome.storage.local.set({ default: JSON.stringify(data) });
}

//画面をロードする処理
//保存したデータを取り出す
var json_string = "[]";
var data;
var sites = [];
chrome.storage.local.get("default", function (value) {
  if (value.default != undefined) {
    json_string = value.default;
    console.log("保存データを取り出しました");
    data = JSON.parse(json_string);
    sites = [];
    for (var i = 0; i < data.length; i++) {
      var site = new Site(i, data[i]);
      sites.push(site);
      site.present();
    }
  }
});
