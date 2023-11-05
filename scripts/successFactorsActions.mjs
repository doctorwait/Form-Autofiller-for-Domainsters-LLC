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

  function xPath(xpathExpression, value = '') {
    const resultType = XPathResult.FIRST_ORDERED_NODE_TYPE;
    const xpathResult = document.evaluate(
      xpathExpression,
      document,
      null,
      resultType,
      null
    );
    const element = xpathResult.singleNodeValue;

    if (element) {
      if (value != '') {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        element.click();
      }
    } else {
      console.error("I'm so stupid to find that: " + xpathExpression);
    }
  }

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
    function (data) {
      function wait(sec = 1) {
        return (new Promise(resolve => setTimeout(resolve, sec * 1000)))();
      }

      const runs = [
        [value, 'fbclc_userName', data.email],
        [value, 'fbclc_emailConf', data.email],
        [value, 'fbclc_pwd', data.password],
        [value, 'fbclc_pwdConf', data.password],
        [value, 'fbclc_fName', data.firstName],
        [value, 'fbclc_lName', data.lastName],
        [dropdown, 'fbclc_country', 'US'],
        [xPath, '//input[@name="fbclc_searPref" and @value="2"]'],
        [wait, 2]
        [click, 'dataPrivacyId'],
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
