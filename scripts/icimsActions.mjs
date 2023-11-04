const icimsBtn = document.getElementById('icimsBtn');
icimsBtn.addEventListener('click', () => {
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

const fillForms = function () {
  chrome.runtime.sendMessage(
    { contentScriptQuery: 'loadJSON' },
    function (data) {
      const runEmail = function (data) {
        document.getElementById('email').value = data.email;
        document.getElementById('enterEmailSubmitButton').click();
      };

      const runs = [runEmail];

      for (const run of runs) {
        try {
          run(data);
        } catch (error) {
          console.error('Ошибка в функции: ' + error);
        }
      }
    }
  );
};

const onResult = function (frames) {
  window.close();
};
