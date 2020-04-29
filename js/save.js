document.getElementById("form").onsubmit = function () {
  var contents = document.getElementById("form").contents.value;
  chrome.storage.local.set({ hold_content: contents });
  return false;
};
