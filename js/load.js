chrome.storage.local.get("hold_content", function (items) {
  document.getElementById("form").contents.value = items.hold_content;
});
