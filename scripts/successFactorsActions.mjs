const successFactorsBtn = document.getElementById('successFactorsBtn');
successFactorsBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true }, function (tabs) {
    var tab = tabs[0];
    if (tab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id, allFrames: true },
          func: fillSuccessFactors,
        },
        onResult
      );
    } else {
      alert('There are no active tabs');
    }
  });
});

const fillSuccessFactors = function () {
  function value(selector, value) {
    document.getElementById(selector).value = value;
  }
  function click(selector) {
    document.getElementById(selector).click();
  }
  function dropdown(selector, ID) {
    const list = document.getElementById(selector);
    list.value = ID;
    const event = new Event('change', { bubbles: true });
    list.dispatchEvent(event);
  }

  chrome.runtime.sendMessage(
    { contentScriptQuery: 'loadJSON' },
    async function (data) {
      async function wait(sec = 1) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
      }

      const runs = [
        [value, 'email', data.email],
      ];

      for (const run of runs) {
        try {
          run[0](...run.slice(1));
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
