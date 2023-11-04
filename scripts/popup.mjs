/* 

Срабатывает при нажатии кнопки

**/

const tryFillBtn = document.getElementById('tryFillBtn');
tryFillBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id, allFrames: true },
          func: fillForms,
        },
        onResult
      );
    } else {
      alert('There are no active tabs');
    }
  });
});

function fillForms() {
  chrome.runtime.sendMessage(
    { contentScriptQuery: 'loadJSON' },
    function (data) {
      // const iframe = document.getElementById('icims_content_iframe');
      // const iframeDocument = iframe.contentDocument;
      document.getElementById('email').value = data.email;
      document.getElementById('enterEmailSubmitButton').click();
    }
  );
}
function onResult(frames) {
  window.close();
}
